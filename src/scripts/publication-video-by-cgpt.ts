// by cgpt: Play reviewed MP4 sources without transcoding, retaining clear figure introductions.
const videos = document.querySelectorAll<HTMLVideoElement>(
  "video[data-publication-video-by-cgpt]",
);

for (const video of videos) {
  const source = video.dataset.videoSrc;
  if (!source) continue;
  const cover = video.parentElement?.querySelector<HTMLImageElement>(
    "img[data-video-cover-by-cgpt]",
  );
  const configuredSeconds = Number(video.dataset.figureSeconds ?? 0);
  const figureSeconds = Number.isFinite(configuredSeconds)
    ? Math.max(0, configuredSeconds)
    : 0;
  let nearViewport = false;
  let loaded = false;
  let played = false;
  let failed = false;

  function updateCover(mediaTime = video.currentTime) {
    if (cover) {
      // Use media time so loading, buffering, pauses and every loop preserve the figure.
      cover.hidden = !failed && played && mediaTime >= figureSeconds;
    }
  }

  function shouldPlay() {
    return nearViewport && !document.hidden && !failed;
  }

  function playWhenVisible() {
    if (!shouldPlay()) return;
    // The property is explicit because browsers distinguish muted from defaultMuted.
    video.muted = true;
    void video.play().catch(() => {
      // Autoplay rejection or an interrupted load keeps a useful image in the card.
      if (!played) updateCover();
    });
  }

  function enterViewport() {
    nearViewport = true;
    if (!loaded) {
      loaded = true;
      video.src = source!;
      video.load();
    }
    playWhenVisible();
  }

  video.addEventListener("playing", () => {
    if (!shouldPlay()) {
      video.pause();
      return;
    }
    played = true;
    updateCover();
  });
  video.addEventListener("canplay", playWhenVisible);
  video.addEventListener("timeupdate", () => updateCover());
  video.addEventListener("seeked", () => updateCover());
  video.addEventListener("error", () => {
    failed = true;
    video.pause();
    updateCover();
  });
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) video.pause();
    else playWhenVisible();
  });

  if ("requestVideoFrameCallback" in video) {
    // Match the figure change to decoded frames where the browser supports it.
    const onFrame: VideoFrameRequestCallback = (_now, metadata) => {
      updateCover(metadata.mediaTime);
      video.requestVideoFrameCallback(onFrame);
    };
    video.requestVideoFrameCallback(onFrame);
  }

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) enterViewport();
          else {
            nearViewport = false;
            video.pause();
          }
        }
      },
      { rootMargin: "100px 0px" },
    );
    observer.observe(video);
  } else {
    enterViewport();
  }
}
