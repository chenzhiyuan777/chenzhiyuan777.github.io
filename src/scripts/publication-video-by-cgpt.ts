// by cgpt: Preserve reviewed MP4 bytes; recover failures through the shared media queue.
import {
  registerPublicationMediaByCgpt,
  retryPublicationMediaByCgpt,
} from "./publication-media-scheduler-by-cgpt";

for (const video of document.querySelectorAll<HTMLVideoElement>("video[data-publication-video-by-cgpt]")) {
  const source = video.dataset.videoSrc;
  if (!source) continue;
  const frame = video.closest<HTMLElement>(".publication-media");
  const cover = frame?.querySelector<HTMLImageElement>("img[data-video-cover-by-cgpt]");
  const action = frame?.querySelector<HTMLButtonElement>("button[data-video-recovery-by-cgpt]");
  const seconds = (value: string | undefined) => Math.max(0, Number(value) || 0);
  const figureSeconds = seconds(video.dataset.figureSeconds);
  const sourceFigureSeconds = Math.max(figureSeconds, seconds(video.dataset.sourceFigureSeconds));
  const hasFrameCallback = typeof video.requestVideoFrameCallback === "function";
  let visible = false;
  let loaded = false;
  let played = false;
  let failed = false;
  let needsGesture = false;
  let needsReload = false;
  let automaticRecovery = true;
  let retries = 0;
  let generation = 0;
  let visibilityEpoch = 0;
  let playAttempt = 0;
  let playPending = false;
  let resumeTime = 0;
  let renderedTime = 0;
  let lastTime = 0;
  let lastProgressAt = performance.now();
  let retryTimer: ReturnType<typeof setTimeout> | undefined;
  let preparation: Promise<void> | undefined;
  let finishPreparation: ((error?: Error) => void) | undefined;
  video.autoplay = false;
  video.defaultMuted = true;
  video.muted = true;

  function state(value: string) {
    video.dataset.videoState = value;
    video.dataset.videoRetryCount = String(retries);
  }
  function showAction(label: string) {
    if (!action) return;
    action.textContent = label;
    action.setAttribute("aria-label", label);
    action.hidden = false;
  }
  function updateCover() {
    // A seek's requested time is not a rendered frame. Keep the HD figure until an action frame arrives.
    if (cover) cover.hidden = !failed && played && !video.seeking && renderedTime >= sourceFigureSeconds;
  }
  function shouldPlay() {
    return visible && loaded && !document.hidden && !failed && !needsGesture;
  }
  function noteProgress(time = video.currentTime) {
    if (Math.abs(time - lastTime) > 0.02) {
      lastTime = time;
      lastProgressAt = performance.now();
      played = true;
    }
  }
  function shortenIntroduction(time: number) {
    // Original bytes retain four seconds. On every natural loop, skip only the excess two seconds.
    if (sourceFigureSeconds > figureSeconds && time >= figureSeconds &&
        time < sourceFigureSeconds && !video.seeking && Number.isFinite(video.duration)) {
      video.currentTime = Math.min(sourceFigureSeconds, video.duration);
    }
  }
  function playWhenVisible() {
    if (!shouldPlay() || !video.paused || playPending) return;
    const attempt = ++playAttempt;
    const epoch = visibilityEpoch;
    const currentGeneration = generation;
    let aborted = false;
    playPending = true;
    video.muted = true;
    void video.play().catch((error: unknown) => {
      if (currentGeneration !== generation) return;
      const name = error instanceof DOMException ? error.name : "";
      if (name === "AbortError") {
        aborted = true;
        return; // pause/load interruptions are not autoplay-policy failures.
      }
      if (!visible || document.hidden) return;
      if (name === "NotAllowedError") {
        needsGesture = true;
        state("needs-play");
        showAction("Play video");
      } else {
        recover("Playback failed", false);
      }
      updateCover();
    }).finally(() => {
      if (attempt !== playAttempt) return;
      playPending = false;
      // Fast out-and-back scrolling can interrupt play() before its Promise settles.
      if (aborted && epoch !== visibilityEpoch && shouldPlay()) playWhenVisible();
    });
  }
  function queueRetry() {
    if (!needsReload || retryTimer || !visible || document.hidden ||
        !navigator.onLine || !automaticRecovery || retries >= 2) return;
    state("retry-scheduled");
    retryTimer = setTimeout(() => {
      retryTimer = undefined;
      retry(false);
    }, retries === 0 ? 750 : 1500);
  }
  function recover(reason: string, canRetry = true) {
    if (failed) return;
    resumeTime = Number.isFinite(video.currentTime) ? video.currentTime : 0;
    failed = true;
    needsReload = true;
    automaticRecovery = canRetry;
    needsGesture = false;
    video.pause();
    finishPreparation?.(new Error(reason));
    state("failed");
    updateCover();
    showAction("Retry video");
    queueRetry();
  }
  function retry(manual: boolean) {
    if (!visible || document.hidden || !navigator.onLine) return;
    // Old preparation has settled before this delayed retry. Never bypass active queue slots.
    if (!retryPublicationMediaByCgpt(video)) return;
    clearTimeout(retryTimer);
    retryTimer = undefined;
    if (manual) retries = 0;
    else retries += 1;
    generation += 1;
    playAttempt += 1;
    playPending = false;
    preparation = undefined;
    finishPreparation = undefined;
    loaded = played = failed = needsReload = needsGesture = false;
    automaticRecovery = true;
    renderedTime = lastTime = 0;
    lastProgressAt = performance.now();
    if (action) action.hidden = true;
    video.pause();
    video.removeAttribute("src");
    video.load(); // no source: release the old request; the scheduler starts the next one.
    state("retry-queued");
    updateCover();
  }

  video.addEventListener("loadedmetadata", () => {
    if (resumeTime > 0 && Number.isFinite(video.duration)) {
      video.currentTime = Math.min(resumeTime, Math.max(0, video.duration - 0.1));
      resumeTime = 0;
    }
  });
  video.addEventListener("playing", () => {
    if (!shouldPlay()) {
      video.pause();
      return;
    }
    lastProgressAt = performance.now();
    state("playing");
    if (action) action.hidden = true;
  });
  video.addEventListener("canplay", playWhenVisible);
  video.addEventListener("timeupdate", () => {
    noteProgress();
    shortenIntroduction(video.currentTime);
    if (!hasFrameCallback) renderedTime = video.currentTime;
    updateCover();
  });
  video.addEventListener("seeked", () => {
    if (!hasFrameCallback && video.readyState >= 2) renderedTime = video.currentTime;
    updateCover();
    playWhenVisible();
  });
  video.addEventListener("error", () => {
    if (!loaded || !video.error) return;
    // A transient first HTTP failure can also be reported as SRC_NOT_SUPPORTED.
    recover("Video unavailable", video.error.code === MediaError.MEDIA_ERR_NETWORK ||
      video.error.code === MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED);
  });
  if (hasFrameCallback) {
    const onFrame: VideoFrameRequestCallback = (_now, metadata) => {
      renderedTime = metadata.mediaTime;
      noteProgress(metadata.mediaTime);
      shortenIntroduction(metadata.mediaTime);
      updateCover();
      video.requestVideoFrameCallback(onFrame);
    };
    video.requestVideoFrameCallback(onFrame);
  }
  action?.addEventListener("click", () => {
    if (needsReload) {
      // Microtask lets a preparation-error handler finish before requesting another queue slot.
      queueMicrotask(() => retry(true));
    } else {
      needsGesture = false;
      lastProgressAt = performance.now();
      playWhenVisible(); // call in the user gesture, using the already-buffered source.
    }
  });
  document.addEventListener("visibilitychange", () => {
    visibilityEpoch += 1;
    lastProgressAt = performance.now();
    if (document.hidden) {
      clearTimeout(retryTimer);
      retryTimer = undefined;
      video.pause();
    } else {
      queueRetry();
      playWhenVisible();
    }
  });
  window.addEventListener("online", () => {
    queueRetry();
    playWhenVisible();
  });
  // A single waiting/stalled event can be ordinary buffering. Require sustained lack of progress.
  setInterval(() => {
    if (!visible || document.hidden || !loaded || failed || needsGesture) return;
    noteProgress();
    if (video.readyState >= 2 && performance.now() - lastProgressAt >= 10_000) {
      recover("Playback made no progress");
    } else if (!playPending && video.paused) {
      playWhenVisible();
    }
  }, 1000);

  registerPublicationMediaByCgpt({
    element: video,
    source,
    prepare() {
      preparation ??= new Promise<void>((resolve, reject) => {
        const currentGeneration = generation;
        let settled = false;
        let timer: ReturnType<typeof setTimeout>;
        const finish = (error?: Error) => {
          if (settled) return;
          settled = true;
          clearTimeout(timer);
          for (const name of ["progress", "canplaythrough", "suspend", "loadeddata"]) {
            video.removeEventListener(name, checkBuffer);
          }
          if (finishPreparation === finish) finishPreparation = undefined;
          if (error) reject(error);
          else resolve();
        };
        const checkBuffer = () => {
          if (currentGeneration !== generation || video.readyState < 2) return;
          const end = video.buffered.length ? video.buffered.end(video.buffered.length - 1) : 0;
          if ((Number.isFinite(video.duration) && end >= video.duration - 0.15) ||
              (video.networkState === HTMLMediaElement.NETWORK_IDLE && video.readyState >= 3)) finish();
        };
        finishPreparation = finish;
        timer = setTimeout(() => {
          if (video.readyState >= 2) finish();
          else recover("Video preparation timed out");
        }, 45_000);
        for (const name of ["progress", "canplaythrough", "suspend", "loadeddata"]) {
          video.addEventListener(name, checkBuffer);
        }
        loaded = true;
        state("preparing");
        lastProgressAt = performance.now();
        video.preload = "auto";
        video.src = source!;
        video.load();
        playWhenVisible(); // do not wait for full buffering or for the 45-second guard.
      });
      return preparation;
    },
    setVisible(value) {
      if (visible !== value) {
        visibilityEpoch += 1;
        lastProgressAt = performance.now();
      }
      visible = value;
      if (!visible) {
        clearTimeout(retryTimer);
        retryTimer = undefined;
        video.pause();
      } else {
        queueRetry();
        playWhenVisible();
      }
    },
  });
  state("idle");
}
