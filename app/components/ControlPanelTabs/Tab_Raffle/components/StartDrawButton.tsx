import React from "react";

const StartDrawButton = () => {
  // Controller tab: on button click
  const startDraw = () => {
    localStorage.setItem(
      "raffleAction",
      JSON.stringify({ action: "start", time: Date.now() })
    );
  };
  return (
    <>
      <button
        className="bg-gray-600 hover:bg-gray-500  px-4 h-[40px] rounded-2xl  cursor-pointer"
        onClick={startDraw}
      >
        Start Draw
      </button>
    </>
  );
};

export default StartDrawButton;
