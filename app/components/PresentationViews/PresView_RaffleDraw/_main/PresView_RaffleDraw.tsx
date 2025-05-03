import React, { useState, useEffect } from "react";

import Background from "../components/Background/_main/Background";
import SlotMachine from "../components/SlotMachine/_main/SlotMachine";

const PresView_RaffleDraw = () => {
  const [boxUnit, setBoxUnit] = useState<number>(50);
  const [boxUnitFontSize, setBoxUnitFontSize] = useState("30px");

  const setupBoxUnit = () => {
    const screenHeight = window.innerHeight;
    const unit = screenHeight / 9;
    setBoxUnit(unit);

    // Font size should be slightly smaller than the box (e.g., 70-80% of unit)
    const fontSize = unit * 0.7;
    setBoxUnitFontSize(`${fontSize}px`);
  };

  useEffect(() => {
    setupBoxUnit();

    window.addEventListener("resize", setupBoxUnit);
    return () => window.removeEventListener("resize", setupBoxUnit);
  }, []);

  return (
    <div className="bg-amber-800 w-full h-screen flex justify-center items-center relative overflow-hidden">
      <div
        className="big-title text-white font-[Ultra]   flex justify-center items-center"
        style={{
          width: `${boxUnit * 12 + 4 * 12}px`,
          height: `${boxUnit * 9}px`,
          fontSize: boxUnitFontSize,
          borderRadius: "8px" // Optional: just to make it look a bit softer
        }}
      >
        CONGRATULATIONS
      </div>
      <SlotMachine boxUnit={boxUnit} />
      <Background boxUnit={boxUnit} />
    </div>
  );
};

export default PresView_RaffleDraw;
