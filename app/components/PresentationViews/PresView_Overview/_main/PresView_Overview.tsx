import React, { useEffect, useState } from "react";
import ParticipantsTable from "../components/ParticipantsTable/ParticipantsTable";
import RegionalStats from "../components/RegionalStats/RegionalStats";

const PresView_Overview = () => {
  return (
    <div className="bg-emerald-800 w-full h-screen overflow-hidden flex justify-center items-center flex-col">
      <div className="big-title text-white text-7xl font-[Montserrat] font-bold pt-8">
        Participants Overview
      </div>
      <div className="table-shell h-0 grow p-10 w-full">
        <ParticipantsTable />
      </div>
      <div className="regional-stats p-10 w-full pt-0">
        <RegionalStats />
      </div>
    </div>
  );
};

export default PresView_Overview;
