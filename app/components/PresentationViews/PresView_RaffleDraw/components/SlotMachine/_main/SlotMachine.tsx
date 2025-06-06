import React, { useEffect, useState } from "react";

import SlotReelWindow from "../components/SlotReelWindow/SlotReelWindow";
import useLocalStorageState from "use-local-storage-state";
import { useWinnerRecords } from "~/hooks/useWinnerRecords";

type SlotMachineProps = {
  boxUnit: number;
};

const SlotMachine = ({ boxUnit }: SlotMachineProps) => {
  const [slotCode, setSlotCode] = useLocalStorageState("slotCode", {
    defaultValue: "KOPIKBLNCA"
  });
  const [showWinnerNth] = useLocalStorageState<number>("showWinnerNth", {
    defaultValue: 0
  });

  const [enableSlotMachineAnimation] = useLocalStorageState(
    "enableSlotMachineAnimation"
  );

  const [slotCodeStatus, setSlotCodeStatus] = useLocalStorageState(
    "slotCodeStatus",
    {
      defaultValue: "idle"
    }
  );

  const [revealWinner, setRevealWinner] = useLocalStorageState("revealWinner", {
    defaultValue: false
  });

  const [winners] = useLocalStorageState<any[] | null>("winners");

  const { winnerRecords, getWinnerByIndex } = useWinnerRecords();
  const winner = getWinnerByIndex(showWinnerNth as 0 | 3 | 1 | 2);

  useEffect(() => {
    setSlotCode(winner?.raffle_code || "KPIKOBLNCA");
  }, [winners, showWinnerNth, winner]); // 👈 safer dependency list

  return (
    <div
      className={`absolute z-[30]  bg-pink-300 origin-center  ${
        enableSlotMachineAnimation && "transition-all"
      } duration-500 ${revealWinner && "-translate-y-1/3 scale-75"}`}
      style={{
        width: `${boxUnit * 12 + 12 * 4 + boxUnit * 0.8}px`,
        height: `${boxUnit * 3 + 2 * (boxUnit * 0.4)}px`,
        padding: `${boxUnit * 0.4}px`, // Fake border using padding
        borderRadius: `${boxUnit * 0.4}px`,
        background: `linear-gradient(to bottom right, #d3d3d3, #555555)`
      }}
    >
      <div
        className="slot-machine-wrapper relative w-full h-full block overflow-hidden"
        style={{
          background: "orange", // Inner background
          borderRadius: "16px" // optional, for smoother shadow along corners
        }}
      >
        <div className="shadow-holder slot-machine-inner absolute top-0 left-0 w-full h-full z-[50] "></div>
        <div className="slot-machine-inner during-roll opacity-0 absolute top-0">
          During Roll
        </div>
        <div className="slot-machine-inner pre-roll bg-[black] w-full h-full">
          <div
            className="reels-shell flex w-full justify-between h-full font-[Ultra]"
            style={{ fontSize: `${boxUnit * 0.8}px` }}
          >
            {slotCode &&
              slotCode
                .split("")
                .map((char, index) => (
                  <SlotReelWindow
                    key={index}
                    nthChar={index}
                    boxUnit={(boxUnit * 12) / 10}
                    codeChar={char}
                    slotCodeStatus={slotCodeStatus}
                  />
                ))}
          </div>
        </div>
        <div className="slot-machine-inner post-roll opacity-0 absolute top-0">
          Post Roll
        </div>
      </div>
    </div>
  );
};

export default SlotMachine;
