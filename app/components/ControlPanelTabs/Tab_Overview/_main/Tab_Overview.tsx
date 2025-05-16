import React, { useState } from "react";

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

  const [clearParticipantsModalOpen, setClearParticipantsModalOpen] =
    useState(false);

  const [showClearParticipantsCheckpoint, setShowClearParticipantsCheckpoint] =
    useState(false);

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
    alert(
      "Attempt to clear participants in backend. Still not working. Will make it work later. This is temporary prompt. Enhancement ongoing."
    );
  };

  const handleClearAllParticipantsFE = async () => {
    alert(
      "Clearing Participants in Front End only. Not working yet. Need preload. This is temporary prompt. Enhancement ongoing."
    );
    // const clearSuccess = await clearAllParticipants();
    // if (clearSuccess) {
    //   setWithParticipantsData(false);
    //   console.log("All Participants Cleared");
    //   setRegionalStats(null);
    //   setFileDetails(null);
    //   // window.location.reload();
    // }
  };

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
                  onClick={handleClearAllParticipantsAppOnly}
                >
                  No, only here on app.
                </button>
                <button
                  className="text-white bg-red-700 hover:bg-red-900 p-2 px-3 rounded-xl cursor-pointer text-sm"
                  onClick={handleClearAllParticipantsEverywhere}
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
    </TabMainBody>
  );
};

export default Tab_Overview;
