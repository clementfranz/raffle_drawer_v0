import React from "react";
import useLocalStorageState from "use-local-storage-state";

const StartDrawButton = () => {
  // Controller tab: on button click
  const [startDraw, setStartDraw] = useLocalStorageState("startDraw", {
    defaultValue: false
  });
  return (
    <>
      <button
        className="bg-gray-600 hover:bg-gray-500  px-4 h-[40px] rounded-2xl  cursor-pointer"
        onClick={() => setStartDraw(true)}
      >
        Start Draw
      </button>
    </>
  );
};

export default StartDrawButton;
