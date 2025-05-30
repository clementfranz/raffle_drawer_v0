import React from "react";

import BGCoffeeCouple from "~/assets/images/CoffeeCoupleBG.png";

const BGDependencyWarning = () => {
  return (
    <div
      className="w-screen h-screen bg-center bg-cover"
      style={{ backgroundImage: `url(${BGCoffeeCouple})` }}
    ></div>
  );
};

export default BGDependencyWarning;
