import React, { useEffect, useRef, useState } from "react";

interface Tab_OverviewProps {
  setIsPresenting?: React.Dispatch<React.SetStateAction<boolean>>;
  isPresenting?: boolean;
  isActiveTab?: boolean;
}

import UploadParticipants from "../components/UploadParticipants/_main/UploadParticipants";
import ParticipantsListSummary from "../components/ParticipantsListSummary/ParticipantsListSummary";

// UI Components
import TabMainBody from "~/ui/ControlPanelUI/TabMainBody/_main/TabMainBody";
import TabShell from "~/ui/ControlPanelUI/TabShell/_main/TabShell";
import TabSubPanel from "~/ui/ControlPanelUI/TabSubPanel/_main/TabSubPanel";
import TabActionButton from "~/ui/ControlPanelUI/TabActionButton/_main/TabActionButton";
import useLocalStorageState from "use-local-storage-state";
import ClearAllPaticipantsButton from "../components/ClearAllPaticipantsButton/ClearAllPaticipantsButton";
import { clearAllParticipants } from "~/hooks/indexedDB/participant/clearAllParticipants";
import { deleteAllDatabaseParticipants } from "~/api/client/participants/deleteAllDatabaseParticipants";

function formatShortTime(seconds: number): string {
  const units = [
    { label: "d", value: Math.floor(seconds / 86400) },
    { label: "h", value: Math.floor((seconds % 86400) / 3600) },
    { label: "m", value: Math.floor((seconds % 3600) / 60) },
    { label: "s", value: seconds % 60 }
  ];

  const result = units.filter((u) => u.value > 0).slice(0, 2);
  return result.length > 0
    ? result.map((u) => `${u.value}${u.label}`).join(" ")
    : "0s";
}

const Tab_Overview: React.FC<Tab_OverviewProps> = ({
  setIsPresenting,
  isPresenting,
  isActiveTab
}) => {
  const [withParticipantsData, setWithParticipantsData] = useLocalStorageState(
    "withParticipantsData"
  );

  const [regionalStats, setRegionalStats] =
    useLocalStorageState("regionalStats");
  const [fileDetails, setFileDetails] = useLocalStorageState<Object | null>(
    "fileDetails",
    { defaultValue: null }
  );

  const confirmClearParticipantsInput = useRef<HTMLInputElement>(null);

  const [clearParticipantsModalOpen, setClearParticipantsModalOpen] =
    useState(false);

  const [showClearParticipantsCheckpoint, setShowClearParticipantsCheckpoint] =
    useState(false);

  const [showFinalCheckpoint, setShowFinalCheckpoint] = useState(false);
  const [clearingPasskey, setClearingPasskey] = useState("");
  const [clearingType, setClearingType] = useState("");
  const [enableFinalClear, setEnableFinalClear] = useState(false);

  useEffect(() => {
    if (showFinalCheckpoint) {
      confirmClearParticipantsInput.current?.focus();
    }

    return () => {};
  }, [showFinalCheckpoint]);

  useEffect(() => {
    const validPasskey = "delete-all-participants";
    if (clearingPasskey === validPasskey) {
      setEnableFinalClear(true);
    } else {
      setEnableFinalClear(false);
    }
  }, [clearingPasskey]);

  const [clearParticipantsLoading, setClearParticipantsLoading] =
    useState(false);

  const startTime = useRef<number>(Date.now());

  const [clearingProgress, setClearingProgress] = useState<number>(0);
  const [ETR, setETR] = useState<number>(60);

  const updateClearingProgress = (deleted: number, total: number) => {
    const progress = (deleted / total) * 100;
    setClearingProgress(progress);

    const now = Date.now();
    const elapsedMs = now - startTime.current;

    if (deleted === 0) {
      setETR(60); // Start with 60 seconds initially
      return;
    }

    // Estimate total time based on progress so far
    const estimatedTotalMs = elapsedMs / (deleted / total);

    // Calculate remaining time in seconds
    const remainingMs = estimatedTotalMs - elapsedMs;
    const remainingSec = Math.ceil(Math.max(0, remainingMs / 1000));

    setETR(remainingSec);
  };

  const startClearing = () => {
    setShowFinalCheckpoint(false);
    if (clearingType === "all") {
      handleClearAllParticipantsEverywhere();
    } else {
      handleClearAllParticipantsAppOnly();
    }
  };

  const finalConfirmationToClear = (type: "all" | "app-only") => {
    setClearingType(type);
    setShowFinalCheckpoint(true);
  };

  const cancelFinalConfirmationClear = () => {
    setShowFinalCheckpoint(false);
    setClearingType("");
  };

  const handleCloseModal = () => {
    setClearParticipantsModalOpen(false);
  };

  const handleProceedClearParticipantsCheckpoint = () => {
    setShowClearParticipantsCheckpoint(true);
  };

  const handleCancelClearParticipantsCheckpoint = () => {
    setShowClearParticipantsCheckpoint(false);
  };

  const handleClearAllParticipantsEverywhere = () => {
    handleClearAllParticipantsBE();
    handleClearAllParticipantsFE();
    handleCloseModal();
  };

  const handleClearAllParticipantsAppOnly = () => {
    handleClearAllParticipantsFE();
    handleCloseModal();
  };

  const handleClearAllParticipantsBE = async () => {
    await deleteAllDatabaseParticipants();
  };

  const handlePasskeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setClearingPasskey(e.target.value);
  };

  const handleClearAllParticipantsFE = async () => {
    setClearParticipantsLoading(true);
    const clearSuccess = await clearAllParticipants(updateClearingProgress);
    if (clearSuccess) {
      setClearParticipantsLoading(false);
      setWithParticipantsData(false);
      setRegionalStats(null);
      setFileDetails(null);
      // window.location.reload();
    }
  };

  useEffect(() => {
    if (clearingProgress >= 100) {
      setClearParticipantsLoading(false);
      setWithParticipantsData(false);
      setRegionalStats(null);
      setFileDetails(null);
    }
  }, [clearingProgress]);

  return (
    <TabMainBody isActive={isActiveTab}>
      <TabShell position="top">
        <TabSubPanel
          title={`${
            withParticipantsData ? "Participants Overview" : "Upload Data"
          }`}
        >
          {withParticipantsData ? (
            <ParticipantsListSummary />
          ) : (
            <UploadParticipants uploadComplete={setWithParticipantsData} />
          )}
        </TabSubPanel>
      </TabShell>
      <TabShell position="bottom">
        {/* <TabActionButton>Present Summary</TabActionButton> */}
        {withParticipantsData ? (
          <ClearAllPaticipantsButton
            openModal={setClearParticipantsModalOpen}
          />
        ) : (
          ""
        )}
      </TabShell>
      <div
        className={`checkpoint bg-[#220404b6] w-full h-full absolute left-0 top-0 text-black flex justify-center items-center ${
          !clearParticipantsModalOpen && "hidden"
        }`}
      >
        <div className="checkpoint-content bg-white rounded-2xl p-4 text-center w-8/10">
          {showClearParticipantsCheckpoint ? (
            <>
              <div className="text-red-600 font-bold">
                Clear All Participants Data:
              </div>
              <div className="text-sm mt-4">
                Do you want to clear participants in the database too?
              </div>
              <div className="choices mt-6 flex gap-3 justify-between w-full flex-col">
                <button
                  className="bg-red-400 hover:bg-red-500 p-2 px-3 rounded-xl cursor-pointer text-sm"
                  onClick={() => {
                    finalConfirmationToClear("app-only");
                  }}
                >
                  No, only here on app.
                </button>
                <button
                  className="text-white bg-red-700 hover:bg-red-900 p-2 px-3 rounded-xl cursor-pointer text-sm"
                  onClick={() => {
                    finalConfirmationToClear("all");
                  }}
                >
                  Yes, on database too.
                </button>
                <button
                  className="bg-gray-400 hover:bg-gray-500 p-2 px-3 rounded-xl cursor-pointer text-sm"
                  onClick={handleCancelClearParticipantsCheckpoint}
                >
                  Go Back
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="text-red-600 font-bold">
                Clear All Participants Data:
              </div>
              <div className="text-sm mt-4">
                Are you sure you want to delete all participants in this batch?
              </div>
              <div className="choices mt-6 flex gap-4 justify-between">
                <button
                  className="bg-gray-400 hover:bg-gray-500 p-2 px-3 rounded-xl cursor-pointer text-sm"
                  onClick={handleCloseModal}
                >
                  Cancel
                </button>
                <button
                  className="bg-red-400 hover:bg-red-500 p-2 px-3 rounded-xl cursor-pointer text-sm"
                  onClick={handleProceedClearParticipantsCheckpoint}
                >
                  Yes, delete.
                </button>
              </div>
            </>
          )}
        </div>
      </div>
      <div
        className={`checkpoint bg-[#220404b6] w-full h-full absolute left-0 top-0 text-black flex justify-center items-center ${
          !clearParticipantsLoading && "hidden"
        }`}
      >
        <div className="checkpoint-content bg-white rounded-2xl p-4 text-center w-8/10">
          <div className="text-red-600 font-bold">Clearing Participants...</div>
          <div className="text-sm mt-4">
            Progress: {clearingProgress.toFixed(2)}%
          </div>
          <div className="text-sm mt-4">
            Time Remaining: {formatShortTime(ETR)}
          </div>
        </div>
      </div>
      <div
        className={`checkpoint bg-[#220404b6] w-full h-full absolute left-0 top-0 text-black flex justify-center items-center ${
          !showFinalCheckpoint && "hidden"
        }`}
      >
        <div className="checkpoint-content bg-white rounded-2xl p-4 text-center w-8/10">
          <div className="text-red-600 font-bold">Enter Confirmation</div>
          <div className="text-sm mt-4">
            You are about to delete{" "}
            {clearingType === "all"
              ? " all participants including saved in database. "
              : " only here saved in this app."}
          </div>
          <div className="text-sm mt-2">
            Please enter "delete-all-participants" all in lower case to confirm
            clearing of participants.
          </div>
          <div className="input-container flex flex-col">
            <input
              type="text"
              name="clearing-passkey"
              autoComplete="off"
              aria-label="clearing-passkey"
              ref={confirmClearParticipantsInput}
              className={`mt-3 h-[30px] px-4 rounded-2xl text-center text-sm  ${
                enableFinalClear
                  ? "bg-amber-200 text-red-800"
                  : "bg-gray-600 text-white"
              }`}
              id=""
              onChange={(e) => {
                handlePasskeyChange(e);
              }}
            />
            <span
              className={`italic text-xs mt-1 ${
                enableFinalClear ? "text-green-600 font-bold" : "text-gray-500"
              }`}
            >
              {!enableFinalClear ? "Passkey do not match" : "Passkey matched"}
            </span>
          </div>
          <div className="choices mt-6 flex gap-4 justify-between">
            <button
              className="bg-gray-400 hover:bg-gray-500 p-2 px-3 rounded-xl cursor-pointer text-sm"
              onClick={cancelFinalConfirmationClear}
            >
              Cancel
            </button>
            <button
              className={` p-2 px-3 rounded-xl  text-sm ${
                enableFinalClear
                  ? "bg-red-400 hover:bg-red-500 cursor-pointer"
                  : "bg-gray-500 text-gray-700 cursor-not-allowed"
              }`}
              onClick={() => {
                if (enableFinalClear) {
                  startClearing();
                }
              }}
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </TabMainBody>
  );
};

export default Tab_Overview;
