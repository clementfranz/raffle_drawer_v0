import React, { useEffect, useState } from "react";

import Blinker from "../Blinker/_main/Blinker";
import useLocalStorageState from "use-local-storage-state";

type SlotColumnProps = {
  boxUnit: number;
  nthColumn: number;
};

const SlotColumn = ({ boxUnit, nthColumn }: SlotColumnProps) => {
  const [firstBulbStatus, setFirstBulbStatus] = useState(false);
  const [secondBulbStatus, setSecondBulbStatus] = useState(false);

  const [revealWinner, setRevealWinner] = useLocalStorageState("revealWinner", {
    defaultValue: false
  });

  const [enableSlotMachineAnimation] = useLocalStorageState(
    "enableSlotMachineAnimation"
  );

  let interval1: NodeJS.Timeout;

  const startDefaultPattern = () => {
    if (nthColumn % 2 !== 0) {
      // Odd column: wait 1 sec before starting
      setFirstBulbStatus(true);
      setSecondBulbStatus(false);
    } else {
      // Even column: start immediately
      setFirstBulbStatus(false);
      setSecondBulbStatus(true);
    }

    // Function to start blinking
    const startBlinking = () => {
      // Blink first bulb every 1 sec
      interval1 = setInterval(() => {
        setFirstBulbStatus((prev) => !prev);
        setSecondBulbStatus((prev) => !prev);
      }, 1000);
    };

    startBlinking();
  };

  const startRollingPattern = () => {};

  const endDefaultPattern = () => {
    clearInterval(interval1);
  };

  useEffect(() => {
    if (enableSlotMachineAnimation) {
      startDefaultPattern();
    } else {
      endDefaultPattern();
    }
    // Cleanup
    return () => {
      endDefaultPattern();
    };
  }, [nthColumn, enableSlotMachineAnimation]);

  return (
    <div
      style={{ width: `${boxUnit + 4}px` }}
      className={`bg-[#039645] odd:bg-[#f3eb58] flex flex-col justify-between items-center py-4 ${
        revealWinner && "scale-110"
      }`}
    >
      <div
        className={`blinkers-top flex flex-col transition-all duration-500 `}
        style={{
          gap: `${boxUnit * 0.5}px`,
          transform: `translateY(${
            revealWinner ? "-" + boxUnit * 1.5 + "px" : "0px"
          })`
        }}
      >
        <Blinker boxUnit={boxUnit} turnOn={firstBulbStatus} />
        <Blinker boxUnit={boxUnit} turnOn={secondBulbStatus} />
      </div>
      <div
        className={`blinkers-top flex flex-col transition-all duration-500 `}
        style={{
          gap: `${boxUnit * 0.5}px`,
          transform: `translateY(${
            revealWinner ? boxUnit * 1.5 + "px" : "0px"
          })`
        }}
      >
        <Blinker boxUnit={boxUnit} turnOn={firstBulbStatus} />
        <Blinker boxUnit={boxUnit} turnOn={secondBulbStatus} />
      </div>
    </div>
  );
};

export default SlotColumn;
