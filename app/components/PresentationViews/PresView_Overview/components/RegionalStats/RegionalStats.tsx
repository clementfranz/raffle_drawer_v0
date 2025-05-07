import React, { useEffect, useState } from "react";
import useLocalStorageState from "use-local-storage-state";

const indexDBName = "ParticipantsDB";
const storeName = "participantsData_raffle2025";

const RegionalStats = () => {
  const [regionalStats, setRegionalStats] = useLocalStorageState<
    { location: string; count: number }[]
  >("regionalStats", {
    defaultValue: []
  });

  const [loadingStats, setLoadingStats] = useState(false);

  return (
    <div className="bg-emerald-400 h-[200px] w-full">
      {!loadingStats ? (
        <div className="flex p-4 w-full h-full justify-between gap-4">
          {regionalStats.map((region, index) => (
            <div
              key={index}
              className="card bg-emerald-700 rounded-2xl w-full flex flex-col justify-center  text-white p-5"
            >
              <div className="region text-2xl capitalize text-center grow flex justify-center items-center">
                {region.location}
              </div>
              <div className="count text-2xl font-bold bg-white text-black rounded-xl h-[50px] mb-4 w-full flex justify-center items-center">
                {region.count.toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex justify-center items-center text-5xl h-full font-[Montserrat]">
          <div className="center-div flex gap-5 justify-center items-center">
            <div className="animate-spin bg-emerald-200 h-[80px] w-[80px] aspect-square rounded-full relative">
              <span className="bg-emerald-600 h-[15px] w-[15px] block rounded-full absolute top-1/2 left-[5px]"></span>
            </div>
            <span>Loading Regional Statistics...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default RegionalStats;
