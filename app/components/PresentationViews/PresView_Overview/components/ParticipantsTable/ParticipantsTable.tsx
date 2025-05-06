import { openDB } from "idb";
import { useEffect, useState } from "react";
import { useLocation } from "react-router";
import useLocalStorageState from "use-local-storage-state";

interface Participant {
  id_entry: number;
  full_name: string;
  raffle_code: string;
  regional_location: string;
  winner_type: string;
  date_chosen: string;
}

import styles from "./ParticipantsTable.module.css";

// inside ParticipantsTable component
const ParticipantsTable = () => {
  const location = useLocation();

  const [withParticipantsData, setWithParticipantsData] = useLocalStorageState(
    "withParticipantsData",
    { defaultValue: false }
  );
  const [tableLocalData, setTableLocalData] = useState<Participant[] | null>(
    null
  );

  const [tableIsLoading, setTableIsLoading] = useState<boolean>(false);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(250);

  const checkUrlAndSetPage = () => {
    const params = new URLSearchParams(location.search);
    const page = parseInt(params.get("page") || "1", 10);
    const size = parseInt(params.get("pageSize") || "250", 10);

    setPageNumber(page);
    setPageSize(size);
  };

  const getDataPerPage = async (
    dbName: string,
    storeName: string,
    pageNo: number,
    size: number
  ): Promise<any[]> => {
    setTableIsLoading(true);
    const db = await openDB(dbName);
    const tx = db.transaction(storeName, "readonly");
    const store = tx.objectStore(storeName);

    const startId = (pageNo - 1) * size + 1;
    const endId = pageNo * size;

    const range = IDBKeyRange.bound(startId, endId);
    const data: any[] = [];

    let cursor = await store.openCursor(range);

    while (cursor) {
      data.push(cursor.value);
      cursor = await cursor.continue();
    }

    await tx.done;
    setTableIsLoading(false);
    return data;
  };

  const fetchData = async (pageNumber: number, pageSize: number) => {
    try {
      const page1 = await getDataPerPage(
        "ParticipantsDB",
        "participantsData_raffle2025",
        pageNumber,
        pageSize
      );
      setTableLocalData(page1);
      setWithParticipantsData(true);
    } catch (error) {
      console.error("Error fetching data:", error);
      setTableLocalData([]);
      setWithParticipantsData(false);
    } finally {
      setTableIsLoading(false);
    }
  };

  useEffect(() => {
    checkUrlAndSetPage();
  }, [location.search]);

  useEffect(() => {
    setTableIsLoading(true);
    fetchData(1, 2500);
  }, []);

  return (
    <>
      {tableLocalData && tableLocalData.length > 0 && !tableIsLoading ? (
        <div
          className={`present-participants-table grow overflow-y-scroll h-full w-full text-black ${styles.participantsTable}`}
        >
          <table className="min-w-full table-fixed border-separate border-spacing-0 ">
            <thead className="bg-emerald-900 text-white sticky top-0 z-10 text-8xl!">
              <tr>
                <th className="p-2 text-left border-b">No.:</th>
                <th className="p-2 text-left border-b">Participant's Name</th>
                <th className="p-2 text-left border-b">Code</th>
                <th className="p-2 text-left border-b">Location</th>
              </tr>
            </thead>
            <tbody className="animate-slideUpX">
              {tableLocalData?.map((entry: Participant, index: number) => (
                <tr key={`participant-${entry.id_entry}-${index}`}>
                  <td>
                    #
                    {entry.id_entry
                      .toString()
                      .padStart(8, "0")
                      .replace(/(\d{2})(\d{3})(\d{3})/, "$1-$2-$3")}
                  </td>
                  <td className="w-1/2">{entry.full_name}</td>
                  <td className="text-base font-bold">{entry.raffle_code}</td>
                  <td>{entry.regional_location}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="participants-table grow overflow-y-auto h-[500px] drop-shadow-none flex bg-gray-300 justify-center items-center text-center">
          {tableIsLoading ? (
            <div className="flex flex-col justify-center gap-4 items-center">
              <div className="animate-spin bg-gray-200 h-[50px] w-[50px] aspect-square rounded-full relative">
                <span className="bg-gray-600 h-[10px] w-[10px] block rounded-full absolute top-1/2 left-[5px]"></span>
              </div>
              Loading New Data. Please wait...
            </div>
          ) : (
            <>
              No data available... <br />
              Upload new data to continue
            </>
          )}
        </div>
      )}
    </>
  );
};

export default ParticipantsTable;
