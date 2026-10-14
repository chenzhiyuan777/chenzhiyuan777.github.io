// by cgpt: Share cover, viewport and background priorities across original MP4 and WebP.
export interface PublicationMediaControllerByCgpt {
  element: HTMLElement;
  source: string;
  prepare: () => Promise<void>;
  setVisible: (visible: boolean) => void;
  prioritize?: () => void;
  cancel?: () => boolean;
}

type ConnectionByCgpt = EventTarget & {
  saveData?: boolean;
  effectiveType?: string;
  downlink?: number;
};
type CardByCgpt = {
  frame: HTMLElement;
  cover: HTMLImageElement | null;
  index: number;
  controller?: PublicationMediaControllerByCgpt;
  state: "pending" | "loading" | "ready" | "failed";
  coverState: "pending" | "loading" | "ready" | "failed";
  coverPromise?: Promise<void>;
  visible: boolean;
  near: boolean;
  ahead: boolean;
  attempt: number;
  centerDistance: number;
  preparingMedia: boolean;
};

const cards: CardByCgpt[] = Array.from(
  document.querySelectorAll<HTMLElement>(".publication-media"),
  (frame, index) => ({
    frame,
    cover: frame.querySelector<HTMLImageElement>(":scope > img[data-publication-cover-by-cgpt]"),
    index,
    state: "pending",
    coverState: "pending",
    visible: false,
    near: false,
    ahead: false,
    attempt: 0,
    centerDistance: Infinity,
    preparingMedia: false,
  }),
);
const connection = (navigator as Navigator & { connection?: ConnectionByCgpt }).connection;
let measuredBytesPerSecond: number | undefined;
let direction = 1;
let lastScroll = window.scrollY;
let lastInteraction = 0;
let scheduled = false;
let idleTimer: ReturnType<typeof setTimeout> | undefined;

function conservativeNetwork() {
  if (connection?.saveData || ["slow-2g", "2g"].includes(connection?.effectiveType ?? "")) return true;
  // Browser estimates can lag or underestimate the current connection. After an
  // actual transfer, prefer measured throughput; explicit data-saving stays strict.
  if (measuredBytesPerSecond !== undefined) return measuredBytesPerSecond < 350_000;
  return connection?.effectiveType === "3g" ||
    (connection?.downlink !== undefined && connection.downlink <= 1.5);
}

function requestUpdate() {
  if (scheduled) return;
  scheduled = true;
  requestAnimationFrame(() => {
    scheduled = false;
    update();
  });
}

function prepareCover(card: CardByCgpt, priority: "high" | "auto") {
  if (card.cover) {
    card.cover.fetchPriority = priority;
    card.cover.loading = "eager";
  }
  if (card.coverPromise) return card.coverPromise;
  card.coverState = "loading";
  card.frame.dataset.coverState = "loading";
  card.coverPromise = (async () => {
    try {
      const cover = card.cover;
      if (cover) {
        let timeout: ReturnType<typeof setTimeout> | undefined;
        try {
          await Promise.race([
            typeof cover.decode === "function" ? cover.decode() : new Promise<void>((resolve, reject) => {
              if (cover.complete) {
                if (cover.naturalWidth) resolve();
                else reject(new Error("Cover unavailable"));
              } else {
                cover.addEventListener("load", () => resolve(), { once: true });
                cover.addEventListener("error", () => reject(new Error("Cover unavailable")), { once: true });
              }
            }),
            new Promise<never>((_, reject) => {
              timeout = setTimeout(() => reject(new Error("Cover timeout")), 10_000);
            }),
          ]);
        } finally {
          clearTimeout(timeout);
        }
        // Give the decoded cover a paint opportunity before changing visible content.
        await new Promise<void>((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));
      }
      card.coverState = "ready";
    } catch {
      // A missing cover must not deadlock an otherwise usable video or animation.
      card.coverState = "failed";
    }
    card.frame.dataset.coverState = card.coverState;
    requestUpdate();
  })();
  return card.coverPromise;
}

function recordThroughput(source: string) {
  const url = new URL(source, document.baseURI).href;
  const entries = performance.getEntriesByName(url) as PerformanceResourceTiming[];
  const entry = [...entries].reverse().find((item) => item.transferSize > 0 && item.encodedBodySize > 64_000);
  if (!entry || entry.responseEnd <= entry.responseStart) return;
  const rate = entry.encodedBodySize * 1000 / (entry.responseEnd - entry.responseStart);
  measuredBytesPerSecond = measuredBytesPerSecond === undefined
    ? rate
    : measuredBytesPerSecond * 0.5 + rate * 0.5;
}

function start(card: CardByCgpt, reason: "visible" | "near" | "background") {
  if (!card.controller || card.state !== "pending") return;
  card.state = "loading";
  card.frame.dataset.mediaState = "loading";
  card.frame.dataset.mediaStartReason = reason;
  const attempt = ++card.attempt;
  card.preparingMedia = false;
  const cover = prepareCover(card, reason === "visible" ? "high" : "auto");
  // Wait only for this card's cover, never every cover on the page. Starting a
  // multi-megabyte animation first can delay its small poster on a slow connection.
  const preparation = cover.then(() => {
    if (attempt !== card.attempt) return;
    const rect = card.frame.getBoundingClientRect();
    if (document.hidden || (reason !== "background" &&
        (rect.bottom <= -100 || rect.top >= window.innerHeight + 100))) {
      // by cgpt: A hidden page or jump during cover loading releases the slot before heavy bytes start.
      card.attempt += 1;
      card.state = "pending";
      card.frame.dataset.mediaState = "pending";
      requestUpdate();
      return;
    }
    card.preparingMedia = true;
    return card.controller!.prepare();
  });
  void preparation.then(() => {
    if (attempt !== card.attempt) return;
    card.state = "ready";
    recordThroughput(card.controller!.source);
  }).catch(() => {
    if (attempt !== card.attempt) return;
    card.state = "failed";
  }).finally(() => {
    if (attempt !== card.attempt) return;
    card.preparingMedia = false;
    card.frame.dataset.mediaState = card.state;
    requestUpdate();
  });
}

function update() {
  const height = window.innerHeight;
  // Expand the upcoming area without starting every distant animation at once.
  const lookAhead = Math.max(300, Math.min(900, height * 0.75));
  for (const card of cards) {
    const rect = card.frame.getBoundingClientRect();
    card.visible = rect.bottom > 0 && rect.top < height;
    card.centerDistance = Math.abs((rect.top + rect.bottom) / 2 - height / 2);
    card.near = rect.bottom > -100 && rect.top < height + 100;
    card.ahead = direction > 0
      ? rect.top >= height && rect.top < height + lookAhead
      : rect.bottom <= 0 && rect.bottom > -lookAhead;
    if (card.near) void prepareCover(card, card.visible ? "high" : "auto");
    const displayReady = card.coverState === "ready" || card.coverState === "failed";
    card.controller?.setVisible(card.visible && !document.hidden && displayReady);
    if (card.visible) card.controller?.prioritize?.();
  }
  if (document.hidden) return;

  const urgent = cards.filter((card) => card.controller && card.state === "pending" && card.near)
    // A jump can show three cards at once: admit the one the viewer is centered on
    // before a partial card at either edge. Background ordering remains top-down.
    .sort((a, b) => Number(b.visible) - Number(a.visible) || a.centerDistance - b.centerDistance || a.index - b.index);
  let foreground = cards.filter((card) => card.controller && card.state === "loading" && card.near).length;
  for (const card of urgent) {
    if (foreground >= 2) break;
    if (cards.filter((item) => item.state === "loading").length >= 3) {
      // A fast jump may abandon several warmups. Keep at most three transfers,
      // replacing an unfinished distant WebP when a new visible card needs a slot.
      const distant = cards.filter((item) => item.state === "loading" && !item.near &&
        (!item.preparingMedia || item.controller?.cancel))
        .sort((a, b) => Math.abs(b.index - card.index) - Math.abs(a.index - card.index));
      const previous = distant.find((item) => !item.preparingMedia || item.controller!.cancel!());
      if (!previous) break;
      previous.attempt += 1;
      previous.state = "pending";
      previous.preparingMedia = false;
      previous.frame.dataset.mediaState = "pending";
    }
    start(card, card.visible ? "visible" : "near");
    foreground += 1;
  }

  // Covers are small: prepare them gradually, without an all-covers completion barrier.
  const loadingCovers = cards.filter((card) => card.coverState === "loading").length;
  const nextCover = cards.find((card) => card.coverState === "pending" &&
    (!conservativeNetwork() || card.ahead));
  if (loadingCovers < 2 && nextCover) void prepareCover(nextCover, "auto");

  const urgentBusy = cards.some((card) => card.controller && card.near &&
    (card.state === "pending" || card.state === "loading"));
  const backgroundBusy = cards.some((card) => card.controller && card.state === "loading" && !card.near);
  if (urgentBusy || backgroundBusy) return;
  const idleDelay = 180 - (performance.now() - lastInteraction);
  if (idleDelay > 0) {
    clearTimeout(idleTimer);
    idleTimer = setTimeout(requestUpdate, idleDelay);
    return;
  }
  const pending = cards.filter((card) => card.controller && card.state === "pending");
  // by cgpt: Prepare only the next two dynamic cards in the reading direction.
  // Count already-ready cards as part of that window so completing a preload
  // cannot silently advance the queue through the entire page while stationary.
  const anchor = cards.filter((card) => card.visible)
    .sort((a, b) => a.centerDistance - b.centerDistance)[0];
  const predicted = cards.filter((card) => card.controller &&
    (anchor
      ? (direction > 0 ? card.index > anchor.index : card.index < anchor.index)
      : card.ahead))
    .sort((a, b) => direction * (a.index - b.index))
    .slice(0, 2);
  const next = predicted.find((card) => pending.includes(card) && card.ahead)
    ?? (!conservativeNetwork() ? predicted.find((card) => pending.includes(card)) : undefined);
  if (next) start(next, "background");
}

export function registerPublicationMediaByCgpt(controller: PublicationMediaControllerByCgpt) {
  const frame = controller.element.closest<HTMLElement>(".publication-media");
  const card = cards.find((item) => item.frame === frame);
  if (!card) return;
  card.controller = controller;
  card.frame.dataset.mediaState = "pending";
  requestUpdate();
}

// by cgpt: Failed videos re-enter the same cover/viewport/slot queue, never a second loader.
export function retryPublicationMediaByCgpt(element: HTMLElement) {
  const frame = element.closest<HTMLElement>(".publication-media");
  const card = cards.find((item) => item.frame === frame);
  if (!card?.controller || card.state === "loading") return false;
  card.attempt += 1;
  card.state = "pending";
  card.preparingMedia = false;
  card.frame.dataset.mediaState = "pending";
  requestUpdate();
  return true;
}

window.addEventListener("scroll", () => {
  if (window.scrollY !== lastScroll) direction = window.scrollY > lastScroll ? 1 : -1;
  lastScroll = window.scrollY;
  lastInteraction = performance.now();
  requestUpdate();
}, { passive: true });
window.addEventListener("resize", requestUpdate);
window.addEventListener("hashchange", requestUpdate);
document.addEventListener("visibilitychange", requestUpdate);
connection?.addEventListener("change", requestUpdate);
requestUpdate();
