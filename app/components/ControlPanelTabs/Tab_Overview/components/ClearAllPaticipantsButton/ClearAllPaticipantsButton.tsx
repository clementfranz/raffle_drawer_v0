import React from "react";
import useLocalStorageState from "use-local-storage-state";
import { clearAllParticipants } from "~/hooks/indexedDB/participant/clearAllParticipants";
import TabActionButton from "~/ui/ControlPanelUI/TabActionButton/_main/TabActionButton";

const ClearAllPaticipantsButton = () => {
  const [fileDetails, setFileDetails] = useLocalStorageState<Object | null>(
    "fileDetails",
    { defaultValue: null }
  );

  const [withParticipantsData, setWithParticipantsData] = useLocalStorageState(
    "withParticipantsData",
    { defaultValue: false }
  );
  const [regionalStats, setRegionalStats] =
    useLocalStorageState("regionalStats");

  const [clearParticipantsLoading, setClearParticipantsLoading] =
    useLocalStorageState("clearParticipantsLoading", { defaultValue: false });

  const handleClearAllParticipants = async () => {
    const clearSuccess = await clearAllParticipants();
    if (clearSuccess) {
      setWithParticipantsData(false);
      console.log("All Participants Cleared");
      setRegionalStats([]);
      setFileDetails(null);
      // window.location.reload();
    }
  };
  return (
    <>
      <TabActionButton onClick={handleClearAllParticipants}>
        Clear All Participants
      </TabActionButton>
    </>
  );
};

export default ClearAllPaticipantsButton;
