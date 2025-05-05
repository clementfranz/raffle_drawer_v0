import React, { useEffect, useState } from "react";

const indexDBName = "ParticipantsDB";
const storeName = "participantsData_raffle2025";

const RegionalStats = () => {
  async function countLocationsFromIndexedDB(): Promise<
    { location: string; count: number }[]
  > {
    return new Promise((resolve, reject) => {
      setLoadingStats(true);
      const request = indexedDB.open(indexDBName);

      request.onerror = () => reject("Failed to open IndexedDB");
      request.onsuccess = () => {
        const db = request.result;
        const transaction = db.transaction(storeName, "readonly");
        const store = transaction.objectStore(storeName);

        const locationsCount: Record<string, number> = {};

        const cursorRequest = store.openCursor();

        cursorRequest.onsuccess = (event) => {
          const cursor = (event.target as IDBRequest<IDBCursorWithValue>)
            .result;
          if (cursor) {
            const data = cursor.value;
            const location = data.regional_location || "Unknown";

            locationsCount[location] = (locationsCount[location] || 0) + 1;

            cursor.continue();
          } else {
            // Convert the map to array of objects
            const result = Object.entries(locationsCount).map(
              ([location, count]) => ({
                location,
                count
              })
            );
            setLoadingStats(false);
            resolve(result);
          }
        };

        cursorRequest.onerror = () => reject("Cursor failed");
      };
    });
  }

  const [regionalStats, setRegionalStats] = useState<
    { location: string; count: number }[]
  >([]);

  const [loadingStats, setLoadingStats] = useState(false);

  useEffect(() => {
    countLocationsFromIndexedDB().then((registeredLocations) => {
      setRegionalStats(registeredLocations);
    });
  }, []);

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
