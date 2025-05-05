import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router";
import { openDB } from "idb";
import useLocalStorageState from "use-local-storage-state";

interface Participant {
  id_entry: number;
  full_name: string;
  raffle_code: string;
  regional_location: string;
  winner_type: string;
  date_chosen: string;
}

function deleteEntryFromRaffleWinners(
  raffle_code: string,
  id_entry: string | number
): Promise<string> {
  return new Promise((resolve, reject) => {
    const request: IDBOpenDBRequest = indexedDB.open("ParticipantsDB"); // use your existing version (5 or higher)

    request.onsuccess = () => {
      const db: IDBDatabase = request.result;
      const transaction: IDBTransaction = db.transaction(
        "raffleWinners",
        "readwrite"
      );
      const store: IDBObjectStore = transaction.objectStore("raffleWinners");

      // Step 1: Get the entry by id_entry first
      const getRequest: IDBRequest<any> = store.get(id_entry);

      getRequest.onsuccess = () => {
        const result = getRequest.result;

        if (result) {
          // Step 2: Verify raffle_code matches
          if (result.raffle_code === raffle_code) {
            // Step 3: Delete
            const deleteRequest: IDBRequest = store.delete(id_entry);

            deleteRequest.onsuccess = () => {
              resolve(
                `Entry with id_entry ${id_entry} and raffle_code ${raffle_code} deleted successfully.`
              );
            };

            deleteRequest.onerror = () => {
              reject(
                `Failed to delete entry: ${
                  deleteRequest.error?.message || "Unknown error"
                }`
              );
            };
          } else {
            reject(
              `raffle_code mismatch. Entry found but raffle_code does not match.`
            );
          }
        } else {
          reject(`No entry found with id_entry ${id_entry}`);
        }
      };

      getRequest.onerror = () => {
        reject(
          `Failed to retrieve entry: ${
            getRequest.error?.message || "Unknown error"
          }`
        );
      };
    };

    request.onerror = () => {
      reject(
        `Failed to open ParticipantsDB: ${
          request.error?.message || "Unknown error"
        }`
      );
    };
  });
}

interface ParticipantsTableProps {
  tableData: Participant[];
  loadingTable: boolean;
}

const ParticipantsTable = ({
  tableData,
  loadingTable
}: ParticipantsTableProps) => {
  const location = useLocation();

  const [withParticipantsData, setWithParticipantsData] = useLocalStorageState(
    "withParticipantsData",
    {
      defaultValue: false
    }
  );
  const [tableLocalData, setTableLocalData] = useState<Participant[] | null>(
    null
  );

  const [tableIsLoading, setTableIsLoading] = useState<boolean>(false);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(250);

  const [activeTab, setActiveTab] = useState("main");

  const getRaffleWinnersBySize = (
    page = 1,
    size = 250,
    type: string = "winner" // Filter by this winner_type
  ): Promise<Participant[]> => {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open("ParticipantsDB");

      request.onsuccess = (event: Event) => {
        const db = (event.target as IDBOpenDBRequest)?.result;
        if (!db) {
          reject("Failed to open DB: Database is null");
          return;
        }
        const transaction = db.transaction(["raffleWinners"], "readonly");
        const store = transaction.objectStore("raffleWinners");

        const winners: Participant[] = [];
        let count = 0;

        const lowerBound = (page - 1) * size;
        const upperBound = page * size;

        // ✅ Use "prev" to get latest records first
        const cursorRequest = store.openCursor(null, "prev");

        cursorRequest.onsuccess = (e: Event) => {
          const cursor = (e.target as IDBRequest<IDBCursorWithValue>)?.result;
          if (cursor) {
            const record = cursor.value as Participant;

            // ✅ Filter records by winner_type
            if (record.winner_type === type) {
              if (count >= lowerBound && count < upperBound) {
                winners.push(record);
              }
              count++;
            }

            cursor.continue();
          } else {
            resolve(winners);
          }
        };

        cursorRequest.onerror = (e: Event) => {
          const error = (e.target as IDBRequest)?.error;
          reject(
            `Failed to fetch raffle winners: ${
              error?.message || "Unknown error"
            }`
          );
        };
      };

      request.onerror = (e: Event) => {
        const error = (e.target as IDBRequest)?.error;
        reject(`Failed to open DB: ${error?.message || "Unknown error"}`);
      };
    });
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

  const checkUrlAndSetPage = () => {
    const params = new URLSearchParams(location.search);

    const page = parseInt(params.get("page") || "1", 10);
    const size = parseInt(params.get("pageSize") || "250", 10);
    const tab = params.get("filter") || "main";

    setPageNumber(page);
    setPageSize(size);
    setActiveTab(tab);
  };

  const removeWinner = (code: string, id: string | number) => {
    deleteEntryFromRaffleWinners(code, id);
    fetchData(activeTab, pageNumber, pageSize);
  };

  useEffect(() => {
    checkUrlAndSetPage();
  }, [location.search]); // run when URL changes

  const fetchData = async (
    activeTab: string,
    pageNumber: number,
    pageSize: number
  ) => {
    try {
      if (activeTab === "main") {
        const page1 = await getDataPerPage(
          "ParticipantsDB",
          "participantsData_raffle2025",
          pageNumber,
          pageSize
        );
        setTableLocalData(page1);
      } else if (activeTab === "winners") {
        const winnersData = await getRaffleWinnersBySize(
          pageNumber,
          pageSize,
          "primary"
        );
        setTableLocalData(winnersData);
      } else {
        const winnersData = await getRaffleWinnersBySize(
          pageNumber,
          pageSize,
          "backup"
        );
        setTableLocalData(winnersData);
      }
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
    setTableIsLoading(true);
    fetchData(activeTab, pageNumber, pageSize);
  }, [pageNumber, pageSize, activeTab]); // run when pageNumber or pageSize changes

  useEffect(() => {
    checkUrlAndSetPage();
  }, []);

  return (
    <>
      {tableLocalData && tableLocalData.length > 0 && !tableIsLoading ? (
        <div className="participants-table grow overflow-y-auto h-[500px]">
          <table className="min-w-full table-fixed border-separate border-spacing-0">
            <thead className="bg-[#bf4759] text-white sticky top-0 z-10">
              <tr>
                <th className="p-2 text-left border-b">No.:</th>
                <th className="p-2 text-left border-b">Participant's Name</th>
                <th className="p-2 text-left border-b">Code</th>
                <th className="p-2 text-left border-b">Location</th>
                {activeTab !== "main" && (
                  <>
                    <th className="p-2 text-left border-b">Draw Date</th>
                    <th className="p-2 text-left border-b">Controls</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody className="">
              {tableLocalData?.map((entry: Participant, index: number) => (
                <tr key={`participant-${entry.id_entry}-${index}`} className="">
                  <td className="">
                    #
                    {entry.id_entry
                      .toString()
                      .padStart(8, "0")
                      .replace(/(\d{2})(\d{3})(\d{3})/, "$1-$2-$3")}
                  </td>
                  <td className="">{entry.full_name}</td>
                  <td className="text-base font-bold">{entry.raffle_code}</td>
                  <td className="">{entry.regional_location}</td>
                  {activeTab !== "main" && (
                    <>
                      <td>
                        {new Date(entry.date_chosen).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "short",
                            day: "2-digit",
                            weekday: "short"
                          }
                        )}
                      </td>
                      <td className="">
                        <button
                          onClick={() => {
                            removeWinner(entry.raffle_code, entry.id_entry);
                          }}
                          className="bg-red-700 text-white p-1 px-2 rounded-lg hover:bg-red-600 cursor-pointer"
                        >
                          Remove
                        </button>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <>
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
        </>
      )}
    </>
  );
};

export default ParticipantsTable;
