import React from "react";

import StartDrawButton from "../components/StartDrawButton";

const Tab_Raffle = () => {
  return (
    <>
      <div className="top-part grow p-4 overflow-y-scroll bg-gradient-to-b from-gray-900 to-gray-800">
        <div className="sub-panel mb-5">
          <h2 className="mb-2">Raffle Draw</h2>
          <div className="raffle-draw-status bg-gray-950 w-full rounded-xl h-[80px] border-gray-600 border-2 flex items-center justify-center text-xl font-[courier] font-bold text-amber-200 text-shadow-amber-500 text-shadow-md ">
            Not Started Yet
          </div>
        </div>
        <div className="sub-panel mb-5 gap-3 flex flex-col">
          <h2>Winner</h2>
          <div className="grid w-full">
            <div className="participant-card text-sm w-full bg-gray-700 p-3 rounded-xl ">
              <div className="participant-name text-xl">Juan Dela Cruz</div>
              <div className="participant-details flex w-full justify-between">
                <div className="participant-location">North Luzon</div>
                <div className="participant-code font-[courier] font-bold tracking-widest">
                  KOPIKOBLANCA
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="sub-panel mb-5 gap-3 flex flex-col">
          <h2>Backup Winners</h2>
          <div className="grid w-full gap-3">
            <div className="participant-card text-sm w-full bg-gray-700 p-3 rounded-xl ">
              <div className="participant-name text-xl">Juan Dela Cruz</div>
              <div className="participant-details flex w-full justify-between">
                <div className="participant-location">North Luzon</div>
                <div className="participant-code font-[courier] font-bold tracking-widest">
                  KOPIKOBLANCA
                </div>
              </div>
            </div>
            <div className="participant-card text-sm w-full bg-gray-700 p-3 rounded-xl ">
              <div className="participant-name text-xl">Juan Dela Cruz</div>
              <div className="participant-details flex w-full justify-between">
                <div className="participant-location">North Luzon</div>
                <div className="participant-code font-[courier] font-bold tracking-widest">
                  KOPIKOBLANCA
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="sub-panel mb-5">
          <h2>Final Winner</h2>
        </div>
      </div>
      <div className="bottom-part flex justify-between items-center text-sm p-4">
        <button className="bg-gray-600 hover:bg-gray-500 px-4 h-[40px] rounded-2xl cursor-pointer">
          Present Summary
        </button>
        <StartDrawButton />
      </div>
    </>
  );
};

export default Tab_Raffle;
