import React, { useEffect, useState } from "react";

import styles from "./Blinker.module.css";

type BlinkerProps = {
  boxUnit: number;
  turnOn: boolean;
};

const Blinker = ({ boxUnit, turnOn = false }: BlinkerProps) => {
  return (
    <div className="blinker-bulb">
      <div
        className={`bulb-case bg-linear-to-br from-gray-500 to-gray-800 aspect-square rounded-full justify-center items-center flex transition-all duration-500`}
        style={{ width: `${boxUnit * 0.8}px` }}
      >
        <div
          className={`bulb-glass w-[70%]  aspect-square rounded-full relative overflow-hidden  ${
            turnOn ? styles.bulbOn : styles.bulbOff
          }`}
        ></div>
      </div>
    </div>
  );
};

export default Blinker;
