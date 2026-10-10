// by cgpt: Load pixel-exact animations only within 100px of the visible page.
const animations = document.querySelectorAll<HTMLImageElement>(
  ".publication-media > img[data-motion-src]",
);

function loadAnimation(image: HTMLImageElement) {
  const source = image.dataset.motionSrc;
  if (!source) return;
  delete image.dataset.motionSrc;

  // Keep the clear first-frame cover visible until the complete animation is ready.
  const animation = new Image();
  animation.onload = () => {
    image.src = source;
    image.dataset.motionLoaded = "true";
  };
  animation.onerror = () => {
    // A failed request keeps the original-resolution cover visible.
    image.dataset.motionSrc = source;
  };
  animation.src = source;
}

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        observer.unobserve(entry.target);
        loadAnimation(entry.target as HTMLImageElement);
      }
    },
    { rootMargin: "100px 0px" },
  );
  animations.forEach((image) => observer.observe(image));
} else {
  animations.forEach(loadAnimation);
}
