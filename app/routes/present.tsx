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

  const startRolling = () => {
    setTriggerRolling(true);
  };

  useEffect(() => {
    const handleBeforeUnload = () => {
      setPresentingStatus("not-presenting");
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  useEffect(() => {
    if (presentingStatus === "not-presenting") {
      window.close();
    }
  }, [presentingStatus]);

  return (
    <main className="flex items-center justify-center pt-16 pb-4 flex-col gap-4">
      <div
        className={`slot-machine-shell transition-all duration-500 ${
          !isPresenting ? "-translate-y-full" : "translate-y-0 flex z-50"
        }`}
      >
        <div className="slot-machine select-none">
          <div className="slot-machine-inner flex">
            <button
              className="aspect-square p-4 bg-white rounded-full mr-4 cursor-pointer hover:bg-gray-200 transition-all duration-200"
              onClick={startRolling}
            >
              Start
            </button>
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
    </main>
  );
}
