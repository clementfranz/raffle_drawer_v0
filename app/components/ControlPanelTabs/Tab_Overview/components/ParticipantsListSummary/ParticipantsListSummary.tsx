// ParticipantsListSummary.tsx
import React, { useEffect, useState } from "react";
import { openDB } from "idb";
import useLocalStorageState from "use-local-storage-state";

const ParticipantsListSummary: React.FC = () => {
  const [regionalStats, setRegionalStats] = useLocalStorageState<
    { location: string; count: number }[]
  >("regionalStats", {
    defaultValue: []
  });

  return (
    <div>
      {/* <h2>Reginal Statistics</h2> */}
      {regionalStats?.map((region) => (
        <div key={region.location} className="flex flex-col mt-2">
          <div className="location text-base">{region.location}</div>
          <div className="regional-count text-2xl font-bold">
            {region.count.toLocaleString()}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ParticipantsListSummary;
