import React from "react";

// UI Components
// UI Components
import TabMainBody from "~/ui/ControlPanelUI/TabMainBody/_main/TabMainBody";
import TabShell from "~/ui/ControlPanelUI/TabShell/_main/TabShell";
import TabSubPanel from "~/ui/ControlPanelUI/TabSubPanel/_main/TabSubPanel";
import TabActionButton from "~/ui/ControlPanelUI/TabActionButton/_main/TabActionButton";
import useLocalStorageState from "use-local-storage-state";

interface Tab_RaffleProps {
  isActiveTab?: boolean;
}
interface RaffleEntry {
  id_entry: string; // Adjusted to string to match the sample data
  date_chosen: string;
  full_name: string;
  id: number;
  isCancelled: boolean;
  raffle_code: string;
  regional_location: string;
  time_registered: string;
}

function storeRaffleWinner(entry: RaffleEntry): Promise<string> {
  return new Promise((resolve, reject) => {
    const request: IDBOpenDBRequest = indexedDB.open("ParticipantsDB", 6); // ✅ version bumped

    request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
      const db = request.result;

      if (!db.objectStoreNames.contains("raffleWinners")) {
        const store = db.createObjectStore("raffleWinners", {
          keyPath: "id_entry"
        });

        // ✅ Create indexes
        store.createIndex("date_chosen", "date_chosen", { unique: false });
        store.createIndex("regional_location", "regional_location", {
          unique: false
        });
        store.createIndex("isCancelled", "isCancelled", { unique: false });
      }
    };

    request.onsuccess = () => {
      const db: IDBDatabase = request.result;
      const transaction: IDBTransaction = db.transaction(
        "raffleWinners",
        "readwrite"
      );
      const store: IDBObjectStore = transaction.objectStore("raffleWinners");

      const addRequest: IDBRequest<IDBValidKey> = store.add(entry);

      addRequest.onsuccess = () => {
        resolve(
          `Entry with id_entry ${entry.id_entry} stored successfully in raffleWinners.`
        );
      };

      addRequest.onerror = () => {
        reject(
          `Failed to store entry: ${
            addRequest.error?.message || "Unknown error"
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

// Function to get record by ID from IndexedDB
function getRecordByIdEntry(id: number): Promise<any> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("ParticipantsDB"); // Open the DB

    request.onsuccess = (event) => {
      const db = (event.target as IDBRequest).result;
      const transaction = db.transaction(
        ["participantsData_raffle2025"], // Object store name
        "readonly"
      );
      const objectStore = transaction.objectStore(
        "participantsData_raffle2025"
      );

      // Since the `id_entry` is unique, we can directly use the object store's `get` method.
      const getRequest = objectStore.get(id); // Use the `id` to get the record

      getRequest.onsuccess = () => {
        if (getRequest.result) {
          const modifiedResult = {
            date_chosen: new Date().toISOString(),
            isCancelled: false,
            ...getRequest.result
          };
          storeRaffleWinner(modifiedResult);
          resolve(modifiedResult); // Return the modified record
        } else {
          reject(`No record found with id_entry: ${id}`);
        }
      };

      getRequest.onerror = () => {
        reject("Error retrieving record");
      };
    };

    request.onerror = () => {
      reject("Error opening database");
    };
  });
}

// Function to generate 3 unique random numbers
function generateRandomNumbers(max: number, exempted: number[] = []): number[] {
  const result: number[] = [];
  const allNumbers = new Set<number>();

  // Ensure we generate 3 unique random numbers
  while (result.length < 4) {
    const randomNum = Math.floor(Math.random() * max) + 1; // Generate number between 1 and max

    // Check if the number is not in the exempted list and hasn't been added already
    if (!exempted.includes(randomNum) && !allNumbers.has(randomNum)) {
      result.push(randomNum);
      allNumbers.add(randomNum);
    }
  }

  return result;
}

const Tab_Raffle = ({ isActiveTab }: Tab_RaffleProps) => {
  const [fileDetails, setFileDetails] = useLocalStorageState<{
    entries: number;
  }>("fileDetails"); // Default to a large value if not set

  const [startDraw, setStartDraw] = useLocalStorageState("startDraw", {
    defaultValue: false
  });

  // Function to generate winners
  const generateWinners = () => {
    // Ensure there's a valid number of entries to avoid generating invalid random numbers
    const maxEntries = fileDetails?.entries || 100000; // Default to 100000 if fileDetails or entries is undefined

    // Generate 3 random numbers
    const randomNumbers = generateRandomNumbers(maxEntries);

    // Fetch the records based on random numbers
    Promise.all(randomNumbers.map((number) => getRecordByIdEntry(number)))
      .then((winnersData) => {
        // Set winners data after fetching all records
        setWinners(winnersData);
      })
      .catch((error) => {
        console.error("Error fetching winners data:", error);
      });
  };

  // Trigger draw start and winner generation
  const triggerStartDraw = () => {
    setIsRevealed(false);
    generateWinners();
    setStartDraw(true);
  };

  const [slotCodeStatus, setSlotCodeStatus] = useLocalStorageState(
    "slotCodeStatus",
    {
      defaultValue: "idle"
    }
  );

  const [revealWinner, setRevealWinner] = useLocalStorageState("revealWinner", {
    defaultValue: false
  });

  const [showWinnerNth, setShowWinnerNth] = useLocalStorageState(
    "showWinnerNth",
    {
      defaultValue: 0
    }
  );

  const [winners, setWinners] = useLocalStorageState<any[] | null>("winners");
  const [isRevealed, setIsRevealed] =
    useLocalStorageState<boolean>("isRevealed");

  const [revealWinner01, setRevealWinner01] = useLocalStorageState(
    "revealWinner01",
    { defaultValue: false }
  );

  const [revealWinner02, setRevealWinner02] = useLocalStorageState(
    "revealWinner02",
    { defaultValue: false }
  );

  const [revealWinner03, setRevealWinner03] = useLocalStorageState(
    "revealWinner03",
    { defaultValue: false }
  );

  const [revealWinner04, setRevealWinner04] = useLocalStorageState(
    "revealWinner04",
    { defaultValue: false }
  );
  const [slotCode, setSlotCode] = useLocalStorageState("slotCode", {
    defaultValue: "????????????"
  });

  const processRevealWinner = (num: number) => {
    setSlotCodeStatus("idle");
    setRevealWinner(false);
    setIsRevealed(false);
    const startRollingTimer = setTimeout(() => {
      setShowWinnerNth(num - 1);
      setSlotCodeStatus("roll");
      clearInterval(startRollingTimer);
    }, 2000);
    const revealWinnerTimer = setTimeout(() => {
      switch (num) {
        case 1:
          setRevealWinner01(true);
          break;
        case 2:
          setRevealWinner02(true);
          break;
        case 3:
          setRevealWinner03(true);
          break;
        case 4:
          setRevealWinner04(true);
          break;

        default:
          break;
      }
      setRevealWinner(true);
      clearInterval(revealWinnerTimer);
    }, 9000);
  };

  const startRevealWinner = (nthWinner: number) => {
    processRevealWinner(nthWinner);
  };

  const handleResetMachine = () => {
    setSlotCodeStatus("idle");
    setRevealWinner(false);
    setIsRevealed(false);
  };

  const handleClearWinners = () => {
    handleResetMachine();
    setRevealWinner01(false);
    setRevealWinner02(false);
    setRevealWinner03(false);
    setRevealWinner04(false);
    setWinners(null);
  };

  return (
    <>
      <TabMainBody isActive={isActiveTab}>
        <TabShell position="top">
          <TabSubPanel title={"Raffle Draw"}>
            <div className="raffle-draw-status bg-gray-950 w-full rounded-xl h-[80px] border-gray-600 border-2 flex items-center justify-center text-xl font-[courier] font-bold text-amber-200 text-shadow-amber-500 text-shadow-md ">
              Not Started Yet
            </div>
          </TabSubPanel>
          <TabSubPanel title={"Winner"} className="gap-3 flex flex-col">
            <div className="grid w-full">
              <div className="participant-card text-sm w-full bg-gray-700 p-3 rounded-xl ">
                {winners && revealWinner01 ? (
                  <>
                    <div className="participant-name text-xl">
                      {winners[0]?.full_name}
                    </div>
                    <div className="participant-details flex w-full justify-between">
                      <div className="participant-location">
                        {winners[0].regional_location}
                      </div>
                      <div className="participant-code font-[courier] font-bold tracking-widest">
                        {winners[0].raffle_code}
                      </div>
                    </div>
                  </>
                ) : (
                  <button
                    className="cursor-pointer hover:bg-amber-300 rounded-2xl text-black w-full p-3 bg-amber-400"
                    onClick={() => {
                      triggerStartDraw();
                      startRevealWinner(1);
                    }}
                  >
                    Start Draw
                  </button>
                )}
              </div>
            </div>
          </TabSubPanel>
          {winners && winners.length > 0 && (
            <TabSubPanel
              title={"Backup Winners"}
              className="gap-3 flex flex-col"
            >
              <div className="grid w-full gap-3">
                <div className="participant-card text-sm w-full bg-gray-700 p-3 rounded-xl ">
                  {revealWinner02 ? (
                    <>
                      <div className="participant-name text-xl">
                        {winners[1]?.full_name}
                      </div>
                      <div className="participant-details flex w-full justify-between">
                        <div className="participant-location">
                          {winners[1].regional_location}
                        </div>
                        <div className="participant-code font-[courier] font-bold tracking-widest">
                          {winners[1].raffle_code}
                        </div>
                      </div>
                    </>
                  ) : (
                    <button
                      className="cursor-pointer hover:bg-amber-300 rounded-2xl text-black w-full p-3 bg-amber-400"
                      onClick={() => {
                        startRevealWinner(2);
                      }}
                    >
                      Raffle First Backup Winner
                    </button>
                  )}
                </div>
              </div>
              <div className="grid w-full gap-3">
                <div className="participant-card text-sm w-full bg-gray-700 p-3 rounded-xl ">
                  {revealWinner03 ? (
                    <>
                      <div className="participant-name text-xl">
                        {winners[2]?.full_name}
                      </div>
                      <div className="participant-details flex w-full justify-between">
                        <div className="participant-location">
                          {winners[2].regional_location}
                        </div>
                        <div className="participant-code font-[courier] font-bold tracking-widest">
                          {winners[2].raffle_code}
                        </div>
                      </div>
                    </>
                  ) : (
                    <button
                      className="cursor-pointer hover:bg-amber-300 rounded-2xl text-black w-full p-3 bg-amber-400"
                      onClick={() => {
                        startRevealWinner(3);
                      }}
                    >
                      Raffle Second Backup Winner
                    </button>
                  )}
                </div>
              </div>
              <div className="grid w-full gap-3">
                <div className="participant-card text-sm w-full bg-gray-700 p-3 rounded-xl ">
                  {revealWinner04 ? (
                    <>
                      <div className="participant-name text-xl">
                        {winners[3]?.full_name}
                      </div>
                      <div className="participant-details flex w-full justify-between">
                        <div className="participant-location">
                          {winners[3].regional_location}
                        </div>
                        <div className="participant-code font-[courier] font-bold tracking-widest">
                          {winners[3].raffle_code}
                        </div>
                      </div>
                    </>
                  ) : (
                    <button
                      className="cursor-pointer hover:bg-amber-300 rounded-2xl text-black w-full p-3 bg-amber-400"
                      onClick={() => {
                        startRevealWinner(4);
                      }}
                    >
                      Raffle Second Backup Winner
                    </button>
                  )}
                </div>
              </div>
            </TabSubPanel>
          )}
          <TabSubPanel title="Proclaimed Winner"></TabSubPanel>
        </TabShell>
        <TabShell position="bottom">
          <TabActionButton onClick={handleResetMachine}>
            Reset Machine
          </TabActionButton>
          <TabActionButton onClick={handleClearWinners}>
            Clear Winners
          </TabActionButton>
        </TabShell>
      </TabMainBody>
    </>
  );
};

export default Tab_Raffle;
