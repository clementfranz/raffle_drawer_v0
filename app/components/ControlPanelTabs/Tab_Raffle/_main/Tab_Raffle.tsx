import React, { useEffect, useState } from "react";

// UI Components
// UI Components
import TabMainBody from "~/ui/ControlPanelUI/TabMainBody/_main/TabMainBody";
import TabShell from "~/ui/ControlPanelUI/TabShell/_main/TabShell";
import TabSubPanel from "~/ui/ControlPanelUI/TabSubPanel/_main/TabSubPanel";
import TabActionButton from "~/ui/ControlPanelUI/TabActionButton/_main/TabActionButton";
import useLocalStorageState from "use-local-storage-state";
import { useWinnerRecords } from "~/hooks/useWinnerRecords";
import type { WinnerRecords, Winner } from "~/types/WinnerTypes";

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
    const request: IDBOpenDBRequest = indexedDB.open("ParticipantsDB", 8); // ✅ version bumped

    request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
      const db = request.result;

      if (!db.objectStoreNames.contains("raffleWinners")) {
        const store = db.createObjectStore("raffleWinners", {
          keyPath: "id", // use auto-incremented id as the primary key
          autoIncrement: true
        });

        // ✅ Create composite index for uniqueness of [id_entry + raffle_code]
        store.createIndex("id_entry_raffle_code", ["id_entry", "raffle_code"], {
          unique: true
        });

        // Other indexes
        store.createIndex("winner_type", "winner_type", { unique: false });
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
function getRecordByIdEntry(id: number, type: string): Promise<any> {
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
            winner_type: type,
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

const generateSingleRandomNumber = (
  max: number,
  exempted: Set<number> = new Set()
): number => {
  let randomNum: number;

  do {
    randomNum = Math.floor(Math.random() * max) + 1;
  } while (exempted.has(randomNum));

  return randomNum;
};

const Tab_Raffle = ({ isActiveTab }: Tab_RaffleProps) => {
  const {
    winnerRecords,
    setWinner,
    setBackupWinner,
    resetWinners,
    getFilledWinners,
    clearBackup,
    getWinnerByIndex
  } = useWinnerRecords();
  const [fileDetails, setFileDetails] = useLocalStorageState<{
    entries: number;
  }>("fileDetails"); // Default to a large value if not set

  const [startDraw, setStartDraw] = useLocalStorageState("startDraw", {
    defaultValue: false
  });

  const [winnerLoading, setWinnerLoading] = useState(false);

  type PresentingStatus = "presenting" | "not-presenting";
  const [presentingStatus] =
    useLocalStorageState<PresentingStatus>("presentingStatus");
  const [presentingView] = useLocalStorageState<string | null>(
    "presentingView"
  );

  useEffect(() => {
    if (winnerLoading) {
      console.log("Generating winner start...");
    } else {
      console.log("Generating winner start...");
    }
  }, [winnerLoading]);

  // ✅ Generate Winner Function (Async with Loading + Return Success Flag)
  const generateWinner = async (
    winnerType: string = "primary",
    nthBackup: 0 | 1 | 2 | 3 = 0
  ): Promise<boolean> => {
    try {
      console.log("Generating winner start");
      setWinnerLoading(true); // Start loading

      // ✅ Ensure there's a valid number of entries
      const maxEntries = Number(fileDetails?.entries) || 999999;

      // ✅ Generate a single random number
      const singleRandomNumber = generateSingleRandomNumber(maxEntries);

      // ✅ Fetch the record
      const winnerData: Winner | null = await getRecordByIdEntry(
        singleRandomNumber,
        winnerType
      );

      if (winnerData) {
        if (winnerType === "primary") {
          console.log("Setting a winner");
          setWinner(winnerData);
        } else {
          console.log("Setting a backup winner");
          setBackupWinner((nthBackup - 1) as 0 | 1 | 2, winnerData);
        }
        return true; // ✅ Success
      } else {
        console.warn("No winner data found");
        return false; // ❌ No winner found
      }
    } catch (error) {
      console.error("Error fetching winner data:", error);
      return false; // ❌ Error
    } finally {
      setWinnerLoading(false); // Stop loading
      console.log("Generating winner ended");
    }
  };

  // ✅ Trigger Draw Start Function (Fixed to be Async)
  const triggerStartDraw = async (
    type: string = "primary",
    nth: 0 | 1 | 2 | 3 = 0
  ) => {
    console.log("Attempting: ", type, " ", nth);
    setIsRevealed(false);

    const successGeneration = await generateWinner(type, nth);

    if (successGeneration) {
      setStartDraw(true);
    } else {
      console.warn("Winner generation failed, draw not started");
    }
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
    defaultValue: "??????????"
  });

  const processRevealWinner = (num: number) => {
    setSlotCodeStatus("idle");
    setRevealWinner(false);
    setIsRevealed(false);
    const startRollingTimer = setTimeout(() => {
      setShowWinnerNth(num - 1);
      setSlotCodeStatus("roll");
      clearInterval(startRollingTimer);
    }, 1000);
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
    }, 3000);
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
    resetWinners();
    setRevealWinner01(false);
    setRevealWinner02(false);
    setRevealWinner03(false);
    setRevealWinner04(false);
    setWinners(null);
  };

  return (
    <>
      <TabMainBody isActive={isActiveTab}>
        <TabShell position="top" className={"relative"}>
          <TabSubPanel title={"Raffle Draw"}>
            <div className="raffle-draw-status bg-gray-950 w-full rounded-xl h-[80px] border-gray-600 border-2 flex items-center justify-center text-xl font-[courier] font-bold text-amber-200 text-shadow-amber-500 text-shadow-md ">
              Not Started Yet
            </div>
          </TabSubPanel>
          <TabSubPanel title={"Winner"} className="gap-3 flex flex-col">
            <div className="grid w-full">
              <div className="participant-card text-sm w-full bg-gray-700 p-3 rounded-xl ">
                {getFilledWinners().primary && revealWinner01 ? (
                  <>
                    <div className="participant-name text-xl">
                      {winnerRecords.primary?.full_name}
                    </div>
                    <div className="participant-details flex w-full justify-between">
                      <div className="participant-location">
                        {winnerRecords.primary?.regional_location}
                      </div>
                      <div className="participant-code font-[courier] font-bold tracking-widest">
                        {winnerRecords.primary?.raffle_code}
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
          {getFilledWinners().backups &&
            getFilledWinners().backups.length > 0 && (
              <TabSubPanel
                title={"Backup Winners"}
                className="gap-3 flex flex-col"
              >
                <div className="grid w-full gap-3">
                  <div className="participant-card text-sm w-full bg-gray-700 p-3 rounded-xl ">
                    {revealWinner02 ? (
                      <>
                        <div className="participant-name text-xl">
                          {winnerRecords.backups[0]?.full_name}
                        </div>
                        <div className="participant-details flex w-full justify-between">
                          <div className="participant-location">
                            {winnerRecords.backups[0]?.regional_location}
                          </div>
                          <div className="participant-code font-[courier] font-bold tracking-widest">
                            {winnerRecords.backups[0]?.raffle_code}
                          </div>
                        </div>
                      </>
                    ) : (
                      <button
                        className="cursor-pointer hover:bg-amber-300 rounded-2xl text-black w-full p-3 bg-amber-400"
                        onClick={() => {
                          console.log("Raffling backup winner #1");
                          triggerStartDraw("backup", 1);
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
                          {winnerRecords.backups[1]?.full_name}
                        </div>
                        <div className="participant-details flex w-full justify-between">
                          <div className="participant-location">
                            {winnerRecords.backups[1]?.regional_location}
                          </div>
                          <div className="participant-code font-[courier] font-bold tracking-widest">
                            {winnerRecords.backups[1]?.raffle_code}
                          </div>
                        </div>
                      </>
                    ) : (
                      <button
                        className="cursor-pointer hover:bg-amber-300 rounded-2xl text-black w-full p-3 bg-amber-400"
                        onClick={() => {
                          console.log("Raffling backup winner #2");
                          triggerStartDraw("backup", 2);
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
                          {winnerRecords.backups[2]?.full_name}
                        </div>
                        <div className="participant-details flex w-full justify-between">
                          <div className="participant-location">
                            {winnerRecords.backups[2]?.regional_location}
                          </div>
                          <div className="participant-code font-[courier] font-bold tracking-widest">
                            {winnerRecords.backups[2]?.raffle_code}
                          </div>
                        </div>
                      </>
                    ) : (
                      <button
                        className="cursor-pointer hover:bg-amber-300 rounded-2xl text-black w-full p-3 bg-amber-400"
                        onClick={() => {
                          console.log("Raffling backup winner #3");
                          triggerStartDraw("backup", 3);
                          startRevealWinner(4);
                        }}
                      >
                        Raffle Third Backup Winner
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
        <div
          className={`checkpoint bg-[#220404b6] w-full h-full absolute left-0 top-0 text-white flex justify-center items-center ${
            presentingStatus === "presenting" &&
            presentingView === "raffle-draw" &&
            "hidden"
          }`}
        >
          <div className="checkpoint-content bg-red-900 rounded-2xl p-4 text-center w-8/10">
            <div>Raffle Controls Disabled</div>
            <div className="text-sm mt-4">
              {presentingStatus !== "presenting" ? (
                <>Please start presentation and switch to raffle view</>
              ) : (
                presentingView !== "raffle-draw" && (
                  <>Please switch view to raffle draw.</>
                )
              )}
            </div>
          </div>
        </div>
      </TabMainBody>
    </>
  );
};

export default Tab_Raffle;
