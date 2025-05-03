import React, { useEffect, useRef, useState } from "react";

import styles from "./PresView_Transition.module.css"; // Adjust the path as needed

import KopikoBlancaLogo from "~/assets/images/KopikoBlancaLogoTrimmed.png";
import KpcTransitionBottomPart from "~/assets/images/KpcTransitionBottomPart.png";
import useLocalStorageState from "use-local-storage-state";

const PresView_Transition = () => {
  const [startTransition, setStartTransition] = useState(false);
  const [endTransition, setEndTransition] = useState(true);

  const [debuggerModeOn, setDebuggerModeOn] = useState(false);

  const [presentingView] = useLocalStorageState<any | null>("presentingView");

  const [transitionActive, setTransitionActive] =
    useLocalStorageState("transitionActive");

  // Track previous state
  const prevPresentingViewRef = useRef<boolean | null>(null);

  const openSesame = () => {
    setEndTransition(true);
    setStartTransition(false);
    setTimeout(() => {
      setTransitionActive(false);
    }, 1500);
  };

  const closeSesame = () => {
    setStartTransition(true);
    setEndTransition(false);
  };

  useEffect(() => {
    if (transitionActive && prevPresentingViewRef.current !== presentingView) {
      const preExitTimer = setTimeout(openSesame, 1500);

      // Update the previous state
      prevPresentingViewRef.current = presentingView;

      return () => {
        clearTimeout(preExitTimer);
      };
    }
  }, [presentingView, endTransition]); // 👈 Also depend on endTransition

  useEffect(() => {
    const closeTimer = setTimeout(closeSesame, 500);

    return () => {
      clearTimeout(closeTimer);
    };
  }, []);

  return (
    <div className="presview-transition w-screen h-screen overflow-hidden flex flex-col relative select-none">
      <div
        className={`top-part bg-green-500 w-full h-full absolute z-[51] transition-all duration-1000 ${
          styles.topPart
        } ${endTransition ? "-translate-y-full" : "delay-400"}`}
      ></div>
      <div
        className={`bottom-part bg-transparent w-full h-full absolute z-[52] bottom-0 scale-110 transition-all duration-1000 ${
          styles.bottomPart
        } ${endTransition ? "translate-y-full" : "delay-400"}`}
      >
        <div
          className={`bg-holder w-screen h-full bg-no-repeat bg-cover bg-center`}
          style={{ backgroundImage: `url(${KpcTransitionBottomPart})` }}
        ></div>
      </div>

      <div
        className={`brand-logo absolute z-[53] h-full w-full top-0 flex flex-col justify-center items-center transition-all duration-700  ${
          endTransition ? "-translate-y-full delay-500" : ""
        }`}
      >
        <div
          className={`aspect-square flex justify-center items-center p-20  rounded-full drop-shadow-gray-700 drop-shadow-lg transition-all duration-500 ${
            styles.imageLogoShell
          } ${endTransition ? "h-full delay-700" : "h-3/4"}`}
        >
          <img src={KopikoBlancaLogo} alt="Kopiko Blanca Logo" />
        </div>
      </div>
      {debuggerModeOn && (
        <div className="debug-bar absolute bg-pink-400 bottom-0 right-0 w-[150px] h-[50px] z-[60] flex gap-4 justify-center items-center">
          {endTransition ? (
            <button
              className="bg-orange-300 hover:bg-orange-400 p-2 rounded-md cursor-pointer"
              onClick={closeSesame}
            >
              Close
            </button>
          ) : (
            <button
              className="bg-orange-300 hover:bg-orange-400 p-2 rounded-md cursor-pointer"
              onClick={openSesame}
            >
              Open
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default PresView_Transition;
