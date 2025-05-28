import React from "react";

import SadOfflineMugBG from "~/assets/images/SadOfflineMugBG.png";

const BGOfflineServer = () => {
  return (
    <div
      className="w-screen h-screen bg-center bg-cover"
      style={{ backgroundImage: `url(${SadOfflineMugBG})` }}
    ></div>
  );
};

export default BGOfflineServer;
