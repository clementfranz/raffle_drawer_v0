import React from "react";

import KopikoBrand from "~/assets/images/Kopiko.svg";

const DefaultLoader = () => {
  return (
    <div className="bg-yellow-950 w-screen h-screen flex justify-center items-center text-white">
      <div className="centered flex flex-col justify-between items-center gap-4">
        <div className="kopiko-logo w-[150px]">
          <img src={KopikoBrand} alt="" />
        </div>
        <div className="animate-pulse">Loading Page...</div>
      </div>
    </div>
  );
};

export default DefaultLoader;
