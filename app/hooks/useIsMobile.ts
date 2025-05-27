import { useState, useEffect } from "react";

export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  const [hasChecked, setHasChecked] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const isEmulated =
        /Chrome/.test(navigator.userAgent) && window.innerWidth > 768;

      const userAgentMatch =
        /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent) &&
        !isEmulated;

      const aspectRatioMatch = window.matchMedia(
        "(max-aspect-ratio: 3/4)"
      ).matches;

      const widthMatch = window.innerWidth <= 768;

      const detectedMobile = userAgentMatch || (aspectRatioMatch && widthMatch);

      setIsMobile(detectedMobile);
      setHasChecked(true);
    };

    checkMobile();

    // Optional: Enable live detection on resize
    // window.addEventListener("resize", checkMobile);
    // return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return { isMobile, hasChecked };
}
