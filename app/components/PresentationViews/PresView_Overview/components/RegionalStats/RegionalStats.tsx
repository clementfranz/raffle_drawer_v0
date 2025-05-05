import React, { useEffect, useState } from "react";

const indexDBName = "ParticipantsDB";
const storeName = "participantsData_raffle2025";

async function countLocationsFromIndexedDB(): Promise<
  { location: string; count: number }[]
> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(indexDBName);

    request.onerror = () => reject("Failed to open IndexedDB");
    request.onsuccess = () => {
      const db = request.result;
      const transaction = db.transaction(storeName, "readonly");
      const store = transaction.objectStore(storeName);

      const locationsCount: Record<string, number> = {};

      const cursorRequest = store.openCursor();

      cursorRequest.onsuccess = (event) => {
        const cursor = (event.target as IDBRequest<IDBCursorWithValue>).result;
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
          resolve(result);
        }
      };

      cursorRequest.onerror = () => reject("Cursor failed");
    };
  });
}

const RegionalStats = () => {
  const [regionalStats, setRegionalStats] = useState<
    { location: string; count: number }[]
  >([]);

  useEffect(() => {
    countLocationsFromIndexedDB().then((registeredLocations) => {
      setRegionalStats(registeredLocations);
    });
  }, []);

  return (
    <>
      {regionalStats.map((region, index) => (
        <div key={index}>
          Region: {region.location} — Count: {region.count}
        </div>
      ))}
    </>
  );
};

export default RegionalStats;
