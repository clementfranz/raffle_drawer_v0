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
import { clearAllParticipants } from "~/hooks/indexedDB/participant/clearAllParticipants";

const Tab_Overview: React.FC<Tab_OverviewProps> = ({
  setIsPresenting,
  isPresenting,
  isActiveTab
}) => {
  const [withParticipantsData, setWithParticipantsData] = useLocalStorageState(
    "withParticipantsData"
  );
  const [fileDetails, setFileDetails] = useLocalStorageState<Object | null>(
    "fileDetails",
    { defaultValue: null }
  );
  const [regionalStats, setRegionalStats] =
    useLocalStorageState("regionalStats");

  const handleClearAllParticipants = async () => {
    const clearSuccess = await clearAllParticipants();
    if (clearSuccess) {
      console.log("All Participants Cleared");
      setWithParticipantsData(false);
      setRegionalStats([]);
      setFileDetails(null);
      // window.location.reload();
    }
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
        <TabActionButton onClick={handleClearAllParticipants}>
          Clear All Participants
        </TabActionButton>
      </TabShell>
    </TabMainBody>
  );
};

export default Tab_Overview;
