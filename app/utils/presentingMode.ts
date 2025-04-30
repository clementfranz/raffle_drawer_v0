// src/utils/presentingMode.ts
export const isBrowser = typeof window !== "undefined";

export const startPresentation = () => {
  if (isBrowser) {
    localStorage.setItem("presentingMode", "1");
  }
};

export const stopPresentation = () => {
  if (isBrowser) {
    localStorage.removeItem("presentingMode");
  }
};

export const isPresentingStatus = () => {
  return isBrowser && localStorage.getItem("presentingMode") !== null;
};

export const killPresentation = () => {
  if (!isBrowser) return;

  if (document.exitFullscreen) document.exitFullscreen();
  else if ((document as any).webkitExitFullscreen)
    (document as any).webkitExitFullscreen();
  else if ((document as any).msExitFullscreen)
    (document as any).msExitFullscreen();

  stopPresentation();
  try {
    window.close();
  } catch (e) {
    console.warn("window.close() was blocked");
  }
};

export const switchView = () => {
  if (!isBrowser) return;

  const isOn = localStorage.getItem("presentingMode");
  if (isOn) stopPresentation();
  else startPresentation();
};
