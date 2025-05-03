import React from "react";

type SlotMachineProps = {
  boxUnit: number;
};

const SlotMachine = ({ boxUnit }: SlotMachineProps) => {
  return (
    <div
      className="absolute  text-7xl z-[30]"
      style={{
        width: `${boxUnit * 12 + 12 * 4 + boxUnit * 0.8}px`,
        height: `${boxUnit * 3 + 3 * 4}px`,
        padding: `${boxUnit * 0.4}px`, // Fake border using padding
        borderRadius: `${boxUnit * 0.4}px`,
        background: `linear-gradient(to bottom right, #d3d3d3, #555555)`, // Border gradient
        boxSizing: "border-box"
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
            <div
              className="slot-reel-window bg-orange-300 h-full flex justify-center items-center"
              style={{ width: `${boxUnit}px` }}
            >
              X
            </div>
            <div
              className="slot-reel-window bg-orange-300 h-full flex justify-center items-center"
              style={{ width: `${boxUnit}px` }}
            >
              X
            </div>
            <div
              className="slot-reel-window bg-orange-300 h-full flex justify-center items-center"
              style={{ width: `${boxUnit}px` }}
            >
              X
            </div>
            <div
              className="slot-reel-window bg-orange-300 h-full flex justify-center items-center"
              style={{ width: `${boxUnit}px` }}
            >
              X
            </div>
            <div
              className="slot-reel-window bg-orange-300 h-full flex justify-center items-center"
              style={{ width: `${boxUnit}px` }}
            >
              X
            </div>
            <div
              className="slot-reel-window bg-orange-300 h-full flex justify-center items-center"
              style={{ width: `${boxUnit}px` }}
            >
              X
            </div>
            <div
              className="slot-reel-window bg-orange-300 h-full flex justify-center items-center"
              style={{ width: `${boxUnit}px` }}
            >
              X
            </div>
            <div
              className="slot-reel-window bg-orange-300 h-full flex justify-center items-center"
              style={{ width: `${boxUnit}px` }}
            >
              X
            </div>
            <div
              className="slot-reel-window bg-orange-300 h-full flex justify-center items-center"
              style={{ width: `${boxUnit}px` }}
            >
              X
            </div>
            <div
              className="slot-reel-window bg-orange-300 h-full flex justify-center items-center"
              style={{ width: `${boxUnit}px` }}
            >
              X
            </div>
            <div
              className="slot-reel-window bg-orange-300 h-full flex justify-center items-center"
              style={{ width: `${boxUnit}px` }}
            >
              X
            </div>
            <div
              className="slot-reel-window bg-orange-300 h-full flex justify-center items-center"
              style={{ width: `${boxUnit}px` }}
            >
              X
            </div>
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
