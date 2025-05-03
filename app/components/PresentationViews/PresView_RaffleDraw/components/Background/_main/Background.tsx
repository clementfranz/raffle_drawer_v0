import React from "react";

import SlotColumn from "../components/SlotColumn/SlotColumn";
import styles from "./Background.module.css";

type BackgroundProps = {
  boxUnit: number;
};

const Background = ({ boxUnit }: BackgroundProps) => {
  const slotMachineWidth = boxUnit * 12 + 4 * 12;
  const slotColumnSize = 12;

  return (
    <div className="absolute top-0 left-0 w-full z-[10] ">
      <div
        className={`background-shell w-full flex justify-center relative ${styles.backgroundShell}`}
      >
        <div
          className={`slot-machine-columns h-screen flex z-[20] ${styles.slotMachineColumns} `}
          style={{ width: `${slotMachineWidth}px` }}
        >
          {Array.from({ length: slotColumnSize }, (_, index) => (
            <SlotColumn boxUnit={boxUnit} nthColumn={index + 1} key={index} />
          ))}
        </div>
        <div className="shadow-overlay absolute bg-linear-to-b from-[#00000000] to-[black] h-full w-full"></div>
      </div>
    </div>
  );
};

export default Background;
