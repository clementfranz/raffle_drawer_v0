import React, { useEffect, useState } from "react";

interface SlotMachineItemProps {
  targetChar: string;
  delayReveal: number;
  triggerRolling?: boolean;
}

const characters = [
  "0",
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "U",
  "V",
  "W",
  "X",
  "Y",
  "Z"
];

const preCharacters = [
  "?",
  "?",
  "?",
  "?",
  "?",
  "K",
  "O",
  "P",
  "I",
  "K",
  "O",
  "B",
  "L",
  "A",
  "N",
  "C",
  "A"
];

import InfinityRollReel from "./InfinityRollReel";
import useLocalStorageState from "use-local-storage-state";

const SlotMachineItem = ({
  targetChar,
  delayReveal,
  triggerRolling
}: SlotMachineItemProps) => {
  const [nthChar, setNthChar] = useState("-300px");

  const [isRolling, setIsRolling] = useState(false);
  const [isRollingEnd, setIsRollingEnd] = useState(false);
  const [isRollingStart, setIsRollingStart] = useState(false);

  const [isRevealed, setIsRevealed] = useState(false);
  const [isRevealedEnd, setIsRevealedEnd] = useState(false);
  const [isRevealedStart, setIsRevealedStart] = useState(false);

  const [startDraw, setStartDraw] = useLocalStorageState("startDraw");

  const revealCode = () => {
    setIsRevealed(true);
    setIsRevealedStart(true);
  };

  const startRolling = () => {
    setIsRollingStart(true);
    const timeoutId = setTimeout(() => {
      setIsRollingStart(false);
      setIsRollingEnd(true);
      revealCode();
    }, 5000);
    return () => clearTimeout(timeoutId);
  };

  useEffect(() => {
    if (triggerRolling) {
      startRolling();
    }
  }, [triggerRolling]);

  useEffect(() => {
    setNthChar((characters.indexOf(targetChar) + 38) * 80 + "px");
    console.log("NTH: ", nthChar);
    console.log("Target: ", targetChar);
  }, [targetChar]);

  useEffect(() => {
    if (startDraw) {
      startRolling();
    }
  }, [startDraw]);

  useEffect(() => {
    const handleStorageChange = (event: any) => {
      if (event.key === "raffleAction") {
        const data = JSON.parse(event.newValue);
        if (data.action === "start") {
          // Trigger slot machine animation here!
          console.log("Start Slot Machine!");
          startRolling();
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);
  return (
    <div className="slot-reel-column flex flex-col">
      <div className="slot-reel-upper-lights">
        <div className="slot-reel-light-blinker"></div>
        <div className="slot-reel-light-blinker"></div>
        <div className="slot-reel-light-blinker"></div>
      </div>
      <div className="slot-reel-shell">
        <div className="slot-reel-preroll text-pink-500 flex flex-col w-full align-center justify-center absolute top-0 left-0 opacity-0">
          {preCharacters.map((char, index) => (
            <div
              key={index}
              className="slot-reel-item w-full aspect-square  flex justify-center items-center"
            >
              {char}
            </div>
          ))}
        </div>
        <InfinityRollReel
          characters={characters}
          isRollingStart={isRollingStart}
          delayReveal={delayReveal}
        />
        <div
          className={`slot-reel flex flex-col w-full align-center justify-center absolute top-[240px] left-0 transition-transform duration-1000 ease-in-out ${
            isRevealedStart ? "opacity-100" : "opacity-0"
          }`}
          onTransitionEnd={() => {
            setIsRevealed(true);
          }}
          style={{
            transform: `translateY(-${isRevealedStart ? nthChar : "-300px"})`,
            transitionTimingFunction: "cubic-bezier(0.5, 0, 0.5, 1)",
            transitionDuration: `${isRevealedStart ? 0.5 : 0}s`,
            transitionDelay: `${delayReveal * 0.5}s`
          }}
        >
          {characters.map((char, index) => (
            <div
              key={index}
              className="slot-reel-item w-full aspect-square  flex justify-center items-center"
            >
              {char}
            </div>
          ))}
          {characters.map((char, index) => (
            <div
              key={index}
              className="slot-reel-item w-full aspect-square  flex justify-center items-center"
            >
              {char}
            </div>
          ))}
        </div>
      </div>

      <div className="slot-reel-lower-lights">
        <div className="slot-reel-light-blinker"></div>
        <div className="slot-reel-light-blinker"></div>
        <div className="slot-reel-light-blinker"></div>
      </div>
    </div>
  );
};

export default SlotMachineItem;
