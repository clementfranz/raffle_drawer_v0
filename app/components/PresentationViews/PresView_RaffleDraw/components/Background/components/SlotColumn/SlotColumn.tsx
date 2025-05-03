import React, { useEffect, useState } from "react";

import Blinker from "../Blinker/_main/Blinker";

type SlotColumnProps = {
  boxUnit: number;
  nthColumn: number;
};

const SlotColumn = ({ boxUnit, nthColumn }: SlotColumnProps) => {
  const [firstBulbStatus, setFirstBulbStatus] = useState(false);
  const [secondBulbStatus, setSecondBulbStatus] = useState(false);

  let interval1: NodeJS.Timeout;
  let interval2: NodeJS.Timeout;
  let timeoutStart1: NodeJS.Timeout;
  let timeoutStart2: NodeJS.Timeout;

  const startDefaultPattern = () => {
    // Function to start blinking
    const startBlinking1 = () => {
      // Blink first bulb every 1 sec
      interval1 = setInterval(() => {
        setFirstBulbStatus((prev) => !prev);
      }, 1000);
    };

    const startBlinking2 = () => {
      // Start second bulb blinking with 1 sec delay
      interval2 = setInterval(() => {
        setSecondBulbStatus((prev) => !prev);
      }, 1000);
    };

    if (nthColumn % 2 !== 0) {
      // Odd column: wait 1 sec before starting
      timeoutStart1 = setTimeout(() => {
        startBlinking1();
      }, 1000);
      startBlinking2();
    } else {
      // Even column: start immediately
      startBlinking1();
      timeoutStart2 = setTimeout(() => {
        startBlinking2();
      }, 1000);
    }
  };

  const startRollingPattern = () => {};

  const endDefaultPattern = () => {
    clearInterval(interval1);
    clearInterval(interval2);
    clearTimeout(timeoutStart1);
    clearTimeout(timeoutStart2);
  };

  useEffect(() => {
    startDefaultPattern();
    // Cleanup
    return () => {
      endDefaultPattern();
    };
  }, [nthColumn]);

  return (
    <div
      style={{ width: `${boxUnit + 4}px` }}
      className={`bg-[#039645] odd:bg-[#f3eb58] flex flex-col justify-between items-center py-4`}
    >
      <div
        className="blinkers-top flex flex-col"
        style={{ gap: `${boxUnit * 0.5}px` }}
      >
        <Blinker boxUnit={boxUnit} turnOn={firstBulbStatus} />
        <Blinker boxUnit={boxUnit} turnOn={secondBulbStatus} />
      </div>
      <div
        className="blinkers-top flex flex-col"
        style={{ gap: `${boxUnit * 0.5}px` }}
      >
        <Blinker boxUnit={boxUnit} turnOn={firstBulbStatus} />
        <Blinker boxUnit={boxUnit} turnOn={secondBulbStatus} />
      </div>
    </div>
  );
};

export default SlotColumn;
