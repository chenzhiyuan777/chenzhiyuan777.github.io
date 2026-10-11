// by cgpt: Play reviewed MP4 sources without transcoding, retaining clear figure introductions.
import { registerPublicationMediaByCgpt } from "./publication-media-scheduler-by-cgpt";

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
  let visible = false;
  let loaded = false;
  let played = false;
  let failed = false;
  let playPending = false;
  let preparation: Promise<void> | undefined;
  // Preloading outside the viewport must not autoplay or consume the introduction.
  video.autoplay = false;

  function updateCover(mediaTime = video.currentTime) {
    if (cover) {
      // Use media time so loading, buffering, pauses and every loop preserve the figure.
      cover.hidden = !failed && played && mediaTime >= figureSeconds;
    }
  }

  function shouldPlay() {
    return visible && loaded && !document.hidden && !failed;
  }

  function playWhenVisible() {
    if (!shouldPlay() || !video.paused || playPending) return;
    // The property is explicit because browsers distinguish muted from defaultMuted.
    video.muted = true;
    playPending = true;
    void video.play().catch(() => {
      // Autoplay rejection or an interrupted load keeps a useful image in the card.
      if (!played) updateCover();
    }).finally(() => { playPending = false; });
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

  registerPublicationMediaByCgpt({
    element: video,
    source,
    prepare() {
      preparation ??= new Promise<void>((resolve, reject) => {
        let settled = false;
        const finish = (error?: Error) => {
          if (settled) return;
          settled = true;
          clearTimeout(timer);
          for (const name of ["progress", "canplaythrough", "suspend", "loadeddata"]) {
            video.removeEventListener(name, checkBuffer);
          }
          video.removeEventListener("error", onError);
          if (error) reject(error);
          else resolve();
        };
        const checkBuffer = () => {
          if (video.readyState < 2) return;
          const duration = video.duration;
          const bufferedEnd = video.buffered.length ? video.buffered.end(video.buffered.length - 1) : 0;
          // Native video buffering can stop before an entire long source is downloaded.
          if ((Number.isFinite(duration) && bufferedEnd >= duration - 0.15) ||
              (video.networkState === HTMLMediaElement.NETWORK_IDLE && video.readyState >= 3)) finish();
        };
        const onError = () => finish(new Error("Video unavailable"));
        const timer = setTimeout(() => {
          if (video.readyState >= 2) finish();
          else finish(new Error("Video timeout"));
        }, 45_000);
        for (const name of ["progress", "canplaythrough", "suspend", "loadeddata"]) {
          video.addEventListener(name, checkBuffer);
        }
        video.addEventListener("error", onError);
        loaded = true;
        video.preload = "auto";
        video.src = source!;
        video.load();
        playWhenVisible();
      });
      return preparation;
    },
    setVisible(value) {
      visible = value;
      if (shouldPlay()) playWhenVisible();
      else video.pause();
    },
  });
}
