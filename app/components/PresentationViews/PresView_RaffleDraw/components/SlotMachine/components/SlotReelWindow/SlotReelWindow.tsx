import React, { useEffect, useState } from "react";
import useLocalStorageState from "use-local-storage-state";

type SlotReelWindow_Props = {
  boxUnit: number;
  codeChar: string;
  slotCodeStatus: string;
  nthChar: number;
};

const reelChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ&$?#@0123456789";

const startingChar = reelChars.indexOf("?");

const SlotReelWindow = ({
  boxUnit,
  codeChar,
  slotCodeStatus,
  nthChar
}: SlotReelWindow_Props) => {
  const singleReelHeight = boxUnit * reelChars.length;
  const [targetPos, setTargetPos] = useState(startingChar);
  const [enableSlotMachineAnimation] = useLocalStorageState(
    "enableSlotMachineAnimation"
  );

  useEffect(() => {
    if (slotCodeStatus === "idle") {
      setTargetPos(startingChar);
    } else if (slotCodeStatus === "roll") {
      setTargetPos(
        reelChars.indexOf(codeChar) + reelChars.length + reelChars.length
      );
    }
  }, [codeChar, slotCodeStatus]);

  return (
    <div
      className="slot-reel-window h-full flex justify-center items-center relative "
      style={{ width: `${boxUnit}px` }}
    >
      <div
        className="reel-window-inset-shadow absolute w-full h-full z-[37]"
        style={{
          background:
            "linear-gradient(to bottom, black 0%, rgba(0,0,0,0.8) 20%, transparent 40%, transparent 60%, rgba(0,0,0,0.8) 80%, black 100%)"
        }}
      ></div>
      <div
        className={`reel-roll absolute flex flex-col left-0 w-full ${
          enableSlotMachineAnimation && "transition-all"
        } ease-in-out duration-1000`}
        style={{
          top: `-${boxUnit * (targetPos - 1)}px`,
          transitionDelay: `${slotCodeStatus === "roll" ? nthChar * 0.5 : 0}s`
        }}
      >
        <div
          className="reel-tape bg-pink text-[#a70000] flex flex-col bg-[white]"
          style={{ width: `${boxUnit}px` }}
        >
          {reelChars.split("").map((char, index) => (
            <div
              key={index}
              className="w-full aspect-square bg-linear-to-br from-[#636363a9] to-[#00000000] flex justify-center items-center p-0 text-center h-full"
            >
              {char}
            </div>
          ))}
          {reelChars.split("").map((char, index) => (
            <div
              key={index}
              className="w-full aspect-square bg-linear-to-br from-[#636363a9] to-[#00000000] flex justify-center items-center p-0 text-center h-full"
            >
              {char}
            </div>
          ))}
          {reelChars.split("").map((char, index) => (
            <div
              key={index}
              className="w-full aspect-square bg-linear-to-br from-[#636363a9] to-[#00000000] flex justify-center items-center p-0 text-center h-full"
            >
              {char}
            </div>
          ))}
          {reelChars.split("").map((char, index) => (
            <div
              key={index}
              className="w-full aspect-square bg-linear-to-br from-[#636363a9] to-[#00000000] flex justify-center items-center p-0 text-center h-full"
            >
              {char}
            </div>
          ))}
        </div>
      </div>
      {/* <span>{codeChar}</span> */}
    </div>
  );
};

export default SlotReelWindow;
