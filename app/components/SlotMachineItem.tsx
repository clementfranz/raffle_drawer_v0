import React, { useEffect, useState } from "react";

interface SlotMachineItemProps {
  targetChar: string;
  delayReveal: number;
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

const SlotMachineItem = ({ targetChar, delayReveal }: SlotMachineItemProps) => {
  const [nthChar, setNthChar] = useState("0px");

  useEffect(() => {
    setNthChar((characters.indexOf(targetChar) + 35) * 100 + "px");
    console.log("NTH: ", nthChar);
    console.log("Target: ", targetChar);
  }, [targetChar]);
  return (
    <div className="slot-reel-column flex flex-col">
      <div className="slot-reel-upper-lights">
        <div className="slot-reel-light-blinker"></div>
        <div className="slot-reel-light-blinker"></div>
        <div className="slot-reel-light-blinker"></div>
      </div>
      <div className="slot-reel-shell">
        <div
          className="slot-reel flex flex-col w-full align-center justify-center absolute top-0 left-0 transition-transform duration-1000 ease-in-out"
          style={{
            transform: `translateY(-${nthChar})`,
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
