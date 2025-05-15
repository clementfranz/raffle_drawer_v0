// ParticipantsListSummary.tsx
import React, { useEffect, useState } from "react";
import { openDB } from "idb";
import useLocalStorageState from "use-local-storage-state";
import RegionalStats from "~/components/PresentationViews/PresView_Overview/components/RegionalStats/RegionalStats";

const ParticipantsListSummary: React.FC = () => {
  const [regionalStats, setRegionalStats] = useLocalStorageState<{
    regions: { location: string; count: number }[];
    dailyAverage: BigInt;
    totalParticipants: number;
  } | null>("regionalStats", {
    defaultValue: null
  });

  return (
    <>
      <div>
        <div className="title text-xl font-bold text-red-300">
          Overall Summaries
        </div>
        <div className="flex flex-col mt-2">
          <div className="location text-base">TOTAL PARTICIPANTS:</div>
          <div className="regional-count text-2xl font-bold">
            {regionalStats?.totalParticipants.toLocaleString()}
          </div>
        </div>
        <div className="flex flex-col mt-2">
          <div className="location text-base">DAILY AVERAGE:</div>
          <div className="regional-count text-2xl font-bold">
            {regionalStats?.dailyAverage.toLocaleString()}
          </div>
        </div>
        <div className="title text-xl mt-5 font-bold text-red-300">
          Regional Statistics
        </div>
        {/* <h2>Reginal Statistics</h2> */}
        {regionalStats?.regions.map((region) => (
          <div key={region.location} className="flex flex-col mt-2">
            <div className="location text-base">{region.location}</div>
            <div className="regional-count text-2xl font-bold">
              {region.count.toLocaleString()}
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default ParticipantsListSummary;
