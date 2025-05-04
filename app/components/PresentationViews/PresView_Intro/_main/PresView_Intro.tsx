import React, { useState, useEffect } from "react";
import KopikoBlancaLogo from "~/assets/images/KopikoBlancaLogoTrimmed.png"; // Ensure your build setup supports importing images
import useLocalStorageState from "use-local-storage-state";

const PresView_Intro = () => {
  const [presentingView, setPresentingView] = useLocalStorageState<
    string | null
  >("presentingView");

  type PresentingStatus = "presenting" | "not-presenting";
  const [presentingStatus, setPresentingStatus] =
    useLocalStorageState<PresentingStatus>("presentingStatus");

  const [isPresenting, setIsPresenting] = useState(false);
  const [isRevealedStart, setIsRevealedStart] =
    useLocalStorageState("isRevealedStart");

  const activatePresentation = () => {
    setIsPresenting(true);
    transitToScreenSaver();
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen();
    } else if ((document as any).webkitRequestFullscreen) {
      (document as any).webkitRequestFullscreen();
    } else if ((document as any).msRequestFullscreen) {
      (document as any).msRequestFullscreen();
    }
  };

  const [transitionActive, setTransitionActive] = useLocalStorageState(
    "transitionActive",
    { defaultValue: false }
  );

  const enterTransition = () => {
    setTransitionActive(true);
  };

  const transitViewTo = (targetView: string) => {
    if (presentingView !== targetView) {
      enterTransition();

      const transitTimer = setTimeout(() => {
        setPresentingView(targetView);

        clearTimeout(transitTimer);
      }, 3000);
    }
  };

  const transitToScreenSaver = () => {
    transitViewTo("screen-saver");
  };

  useEffect(() => {
    const handleBeforeUnload = () => {
      setPresentingStatus("not-presenting");
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      setIsRevealedStart(false);
    };
  }, []);

  useEffect(() => {
    if (presentingStatus === "not-presenting") {
      window.close();
    }
  }, [presentingStatus]);
  return (
    <div className="bg-gray-800 w-full h-full flex justify-center items-center">
      <div className="default-screensaver-inner flex flex-col items-center justify-center gap-4">
        <img
          src={KopikoBlancaLogo}
          alt="Kopiko Blanca Logo"
          className="h-[250px]"
        />
        <h1 className="text-3xl font-bold text-white">Kopiko Blanca Raffle</h1>
        <p className="text-lg text-gray-300">Welcome to the Raffle!</p>
        <p className="text-lg text-gray-300">Please wait...</p>
        <button
          className="p-2 px-4 bg-gray-950 text-white rounded-2xl cursor-pointer hover:bg-gray-900"
          onClick={activatePresentation}
        >
          Activate Presentation
        </button>
      </div>
    </div>
  );
};

export default PresView_Intro;
