import React, { useState, useEffect } from "react";

import Background from "../components/Background/_main/Background";
import SlotMachine from "../components/SlotMachine/_main/SlotMachine";
import UpperDiv from "../components/UpperDiv/_main/UpperDiv";
import LowerDiv from "../components/LowerDiv/_main/LowerDiv";
import useLocalStorageState from "use-local-storage-state";

const PresView_RaffleDraw = () => {
  const [boxUnit, setBoxUnit] = useState<number>(50);
  const [showRaffleView, setShowRaffleView] = useLocalStorageState(
    "showRaffleView",
    {
      defaultValue: false
    }
  );
  const [winners] = useLocalStorageState<any[] | null>("winners");

  const [slotCodeStatus, setSlotCodeStatus] = useLocalStorageState(
    "slotCodeStatus",
    {
      defaultValue: "idle"
    }
  );
  const [revealWinner, setRevealWinner] = useLocalStorageState("revealWinner", {
    defaultValue: false
  });

  const [enableSlotMachineAnimation, setEnableSlotMachineAnimation] =
    useLocalStorageState("enableSlotMachineAnimation", { defaultValue: false });

  const setupBoxUnit = () => {
    const screenHeight = window.innerHeight;
    const unit = screenHeight / 9;
    setBoxUnit(unit);
  };

  useEffect(() => {
    setupBoxUnit();
    setRevealWinner(false);
    setSlotCodeStatus("idle");
    setEnableSlotMachineAnimation(false);

    const animationTimer = setTimeout(() => {
      setEnableSlotMachineAnimation(true);
    }, 3000);

    window.addEventListener("resize", setupBoxUnit);
    return () => {
      clearInterval(animationTimer);
      window.removeEventListener("resize", setupBoxUnit);
    };
  }, []);

  return (
    <div
      className={`raffle-view-shell w-full h-screen absolute top-0 flex ${
        showRaffleView ? "z-[40] opacity-100" : "-z-[10] opacity-0"
      }`}
    >
      <div
        className={`bg-amber-800 w-full h-screen justify-center items-center relative flex overflow-hidden `}
      >
        <SlotMachine boxUnit={boxUnit} />
        <UpperDiv boxUnit={boxUnit} />
        <LowerDiv boxUnit={boxUnit} />
        <Background boxUnit={boxUnit} />
      </div>
    </div>
  );
};

export default PresView_RaffleDraw;
