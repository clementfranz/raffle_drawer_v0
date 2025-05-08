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
import { addWinnerParticipant } from "~/hooks/indexedDB/winnerParticipant/addWinnerParticipant";
import { pickRandomParticipant } from "~/hooks/indexedDB/_main/useIndexedDB";
import { updateWinnerParticipant } from "~/hooks/indexedDB/winnerParticipant/updateWinnerParticipant";

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

  const [withParticipantsData, setWithParticipantsData] = useLocalStorageState(
    "withParticipantsData"
  );

  const [favoredRegion] = useLocalStorageState<string | undefined>(
    "favoredRegion"
  );

  const [winnerLoading, setWinnerLoading] = useState(false);

  const [isWinnerValid, setIsWinnerValid] = useState(true);
  const [invalidWInnerModalOn, setInvalidWInnerModalOn] = useState(false);

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

  // ✅ Trigger Draw Start Function (Fixed to be Async)
  const triggerStartDraw = async (
    type: "primary" | "backup" = "primary",
    nth: 0 | 1 | 2 = 0
  ) => {
    console.log("Attempting: ", type, " ", nth);
    setIsRevealed(false);

    const participant = await handlePickRandomParticipant(type, favoredRegion);

    if (participant) {
      if (type === "primary") {
        setWinner(participant);
        console.log("Setting Winner");
        startRevealWinner(1);
      } else {
        console.log("Setting Backup Winner");
        if (nth === 0 || nth === 1 || nth === 2) {
          setBackupWinner(nth, participant);
          startRevealWinner(nth + 2);
        }
      }
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

  const [refreshTable, setRefreshTable] = useLocalStorageState("refreshTable", {
    defaultValue: 0
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
      setRefreshTable((prev) => {
        return prev + 1;
      });
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

  const saveWinnerParticipant = async (
    participant: any,
    winnerType: "primary" | "backup"
  ): Promise<boolean> => {
    try {
      const saveWinner = await addWinnerParticipant(participant, winnerType);
      if (!saveWinner) {
        console.error("Failed to save winner:", participant.full_name);
        return false;
      }

      const updateWinner = await updateWinnerParticipant(
        participant.raffle_code
      );
      if (!updateWinner) {
        console.error("Failed to update winner:", participant.full_name);
        return false;
      }

      console.log(
        "Success saving winner: ",
        participant.full_name,
        " with winner type of ",
        winnerType
      );

      return true;
    } catch (error) {
      console.error("Error saving winner:", participant.full_name, error);
      return false;
    }
  };

  const handlePickRandomParticipant = async (
    winnerType: "primary" | "backup" = "primary",
    region?: string | null
  ) => {
    console.log("Picking Random Participant");
    try {
      const participant = await pickRandomParticipant(region ?? undefined);
      if (participant) {
        saveWinnerParticipant(participant, winnerType);
        console.log(participant);
        setIsWinnerValid(true);
      }
      return participant;
    } catch (error) {
      setIsWinnerValid(false);
      handleResetMachine();
      setInvalidWInnerModalOn(true);
      console.error("Error picking random participant:", error);
      return null;
    }
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
                          triggerStartDraw("backup", 0);
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
                          triggerStartDraw("backup", 1);
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
                          triggerStartDraw("backup", 2);
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
          <div
            className={`checkpoint bg-[#220404b6] w-full h-full absolute left-0 top-0 text-white flex justify-center items-center ${
              !invalidWInnerModalOn && "hidden"
            }`}
          >
            <div className="checkpoint-content bg-red-900 rounded-2xl p-4 text-center w-8/10">
              <div>No Participant Available</div>
              {favoredRegion !== undefined ? (
                <div className="text-sm mt-4">
                  No winners can be raffled anymore in the specified region.
                  <br />[{favoredRegion}]
                  <br /> Please retry with different region.
                  <div className="button-container mt-4">
                    <button
                      onClick={() => {
                        setInvalidWInnerModalOn(false);
                      }}
                      className="bg-black hover:bg-red-950 text-white p-3 cursor-pointer rounded-2xl w-full"
                    >
                      Okay
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-sm mt-4">
                  No more available participants to draw. <br />
                  Please add more participants
                  <div className="button-container mt-4">
                    <button
                      onClick={() => {
                        setInvalidWInnerModalOn(false);
                      }}
                      className="bg-black hover:bg-red-950 text-white p-3 cursor-pointer rounded-2xl w-full"
                    >
                      Okay
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
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
            withParticipantsData &&
            "hidden"
          }`}
        >
          <div className="checkpoint-content bg-red-900 rounded-2xl p-4 text-center w-8/10">
            <div>Raffle Controls Disabled</div>
            <div className="text-sm mt-4">
              {presentingStatus !== "presenting" ? (
                <>Please start presentation and switch to raffle view</>
              ) : presentingView !== "raffle-draw" ? (
                <>Please switch view to raffle draw.</>
              ) : (
                <>
                  No Data available for raffle. <br /> Please upload data first.{" "}
                </>
              )}
            </div>
          </div>
        </div>
      </TabMainBody>
    </>
  );
};

export default Tab_Raffle;
