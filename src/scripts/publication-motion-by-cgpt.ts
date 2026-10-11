// by cgpt: Preload original lossless animations through the shared priority queue.
import { registerPublicationMediaByCgpt } from "./publication-media-scheduler-by-cgpt";

const animations = document.querySelectorAll<HTMLImageElement>(
  ".publication-media > img[data-motion-src]",
);

for (const image of animations) {
  const source = image.dataset.motionSrc;
  if (!source) continue;
  let animation: HTMLImageElement | undefined;
  let preparation: Promise<void> | undefined;
  let ready = false;
  let visible = false;
  let priority: "high" | "low" = "low";
  let cancelPreparation: (() => void) | undefined;

  function displayWhenReady() {
    if (!ready || !visible || image.dataset.motionLoaded === "true") return;
    // Background preloads keep the static cover until this card is actually visible.
    image.src = source!;
    delete image.dataset.motionSrc;
    image.dataset.motionLoaded = "true";
  }

  registerPublicationMediaByCgpt({
    element: image,
    source,
    prepare() {
      preparation ??= new Promise<void>((resolve, reject) => {
        animation = new Image();
        animation.fetchPriority = priority;
        const timer = setTimeout(() => {
          animation!.onload = null;
          animation!.onerror = null;
          animation!.src = "";
          cancelPreparation = undefined;
          reject(new Error("Animation timeout"));
        }, 45_000);
        cancelPreparation = () => {
          clearTimeout(timer);
          animation!.onload = null;
          animation!.onerror = null;
          animation!.src = "";
          animation = undefined;
          preparation = undefined;
          cancelPreparation = undefined;
          reject(new DOMException("Prefetch superseded by visible media", "AbortError"));
        };
        animation.onload = () => {
          clearTimeout(timer);
          cancelPreparation = undefined;
          ready = true;
          displayWhenReady();
          resolve();
        };
        animation.onerror = () => {
          clearTimeout(timer);
          cancelPreparation = undefined;
          // Keep the full-resolution cover if the original animation is unavailable.
          reject(new Error("Animation unavailable"));
        };
        animation.src = source!;
      });
      return preparation;
    },
    setVisible(value) {
      visible = value;
      displayWhenReady();
    },
    prioritize() {
      priority = "high";
      if (animation) animation.fetchPriority = priority;
    },
    cancel() {
      if (!cancelPreparation || visible || ready) return false;
      cancelPreparation();
      return true;
    },
  });
}
