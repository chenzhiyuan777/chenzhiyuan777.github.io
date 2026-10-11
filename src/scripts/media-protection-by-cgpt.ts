// These are UI restrictions, not access control for publicly served media.
for (const media of document.querySelectorAll<HTMLImageElement | HTMLVideoElement>("img, video")) {
  media.draggable = false;
  if (media instanceof HTMLVideoElement) {
    media.controls = false;
    media.setAttribute("controlslist", "nodownload");
    media.disablePictureInPicture = true;
    media.disableRemotePlayback = true;
  }
}

function preventMediaSave(event: Event) {
  if (event.target instanceof Element && event.target.closest("img, video")) {
    event.preventDefault();
  }
}

document.addEventListener("contextmenu", preventMediaSave, { capture: true });
document.addEventListener("dragstart", preventMediaSave, { capture: true });
