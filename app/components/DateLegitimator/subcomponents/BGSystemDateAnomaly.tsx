import React from "react";
import BrokenTimeBG from "~/assets/images/BrokenTimeBG.png";

const BGSystemDateAnomaly = () => {
  return (
    <div
      className="w-screen h-screen bg-center bg-cover"
      style={{ backgroundImage: `url(${BrokenTimeBG})` }}
    ></div>
  );
};

export default BGSystemDateAnomaly;
