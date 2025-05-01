import { useEffect, useState } from "react";

import type { Route } from "./+types/home";

import SlotMachineItem from "~/components/SlotMachineItem";
import KopikoBlancaLogo from "~/assets/images/KopikoBlancaLogoTrimmed.png"; // Ensure your build setup supports importing images
import useLocalStorageState from "use-local-storage-state";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Kopiko Blanca Raffle" },
    { name: "description", content: "Welcome to Kopiko Blanca Raffle!" }
  ];
}

export default function Present() {
  const ANCode = "KOPIKOBLANCA";

  type PresentingStatus = "presenting" | "not-presenting";

  const [presentingStatus, setPresentingStatus] =
    useLocalStorageState<PresentingStatus>("presentingStatus");

  const [startDraw, setStartDraw] = useLocalStorageState("startDraw", {
    defaultValue: false
  });

  const [isPresenting, setIsPresenting] = useState(false);
  const [triggerRolling, setTriggerRolling] = useState(false);

  const activatePresentation = () => {
    setIsPresenting(true);
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen();
    } else if ((document as any).webkitRequestFullscreen) {
      (document as any).webkitRequestFullscreen();
    } else if ((document as any).msRequestFullscreen) {
      (document as any).msRequestFullscreen();
    }
  };

  useEffect(() => {
    const handleBeforeUnload = () => {
      setPresentingStatus("not-presenting");
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      setStartDraw(false);
    };
  }, []);

  useEffect(() => {
    if (presentingStatus === "not-presenting") {
      setStartDraw(false);
      window.close();
    }
  }, [presentingStatus]);

  return (
    <main className="flex items-center justify-center pt-16 pb-4 flex-col gap-4 h-screen overflow-hidden relative">
      <div
        className={`slot-machine-shell transition-all duration-500 h-screen overflow-hidden ${
          !isPresenting ? "-translate-y-full" : "translate-y-0 flex z-50"
        }`}
      >
        <div className="slot-machine select-none">
          <div className="slot-machine-inner flex">
            {ANCode.split("").map((char, index) => (
              <SlotMachineItem
                key={index}
                targetChar={char}
                delayReveal={index + 1}
                triggerRolling={triggerRolling}
              />
            ))}
          </div>
        </div>
      </div>
      <div className="default-screensaver w-full h-screen bg-gray-800 overflow-hidden absolute top-0 left-0 items-center justify-center grid place-items-center">
        <div className="default-screensaver-inner flex flex-col items-center justify-center gap-4">
          <img
            src={KopikoBlancaLogo}
            alt="Kopiko Blanca Logo"
            className="h-[250px]"
          />
          <h1 className="text-3xl font-bold text-white">
            Kopiko Blanca Raffle
          </h1>
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
      {/* BELOW IS FOR NAME OF PARTICIPANT */}
      <div
        className={`participant-details absolute z-60 flowing-gradient min-w-[1000px] p-8 rounded-2xl flex flex-col justify-center items-center transition-all duration-500 delay-[12s] ${
          startDraw
            ? "top-1/2 translate-y-[150px] opacity-100 "
            : "bottom-0 translate-y-full opacity-0"
        } `}
      >
        <div className="participant-name text-7xl font-bold w-full text-center">
          John Kevin Dela Cruz - Conrado
        </div>
        <div className="participant-region text-center text-5xl bg-white mt-8 uppercase p-4 px-6 rounded-2xl">
          Central Luzon
        </div>
      </div>
      {/* CONGRATULATIONS TEXT */}

      {/* BELOW IS FOR NAME OF PARTICIPANT */}
      <div
        className={`participant-details absolute z-60 min-w-[1000px] p-8 rounded-2xl flex flex-col justify-center items-center transition-all duration-500 delay-[12s] tracking-widest ${
          startDraw
            ? "top-1/2 -translate-y-[300px] opacity-100 "
            : "top-0 -translate-y-full opacity-0"
        } `}
      >
        <div className="participant-name text-7xl tracking-[20px] w-full text-center font-[Ultra] text-red-800  animate-bounce text-shadow-black text-shadow-2xs bg-[#fef3c6bd] p-4 rounded-4xl">
          CONGRATULATIONS!
        </div>
      </div>

      {/* BELOW IS FOR KOPIKO BLANCA RAFFLE LOGO */}
      <div
        className={`absolute z-100  flex justify-center items-center flex-col gap-10 transition-all duration-500 ${
          startDraw || !isPresenting
            ? "top-0 -translate-y-full"
            : "top-1/2 -translate-y-1/2"
        }`}
      >
        <img
          src={KopikoBlancaLogo}
          alt="Kopiko Blanca Logo"
          className="h-[500px]"
        />
        <div className="logo-text text-6xl font-[Ultra] text-[black] bg-[#f3eb589f] p-8 rounded-4xl">
          Kopiko Blanca Raffle Draw
        </div>
      </div>
    </main>
  );
}
