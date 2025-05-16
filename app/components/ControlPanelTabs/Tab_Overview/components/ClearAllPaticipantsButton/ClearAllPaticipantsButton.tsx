import React from "react";
import useLocalStorageState from "use-local-storage-state";
import { clearAllParticipants } from "~/hooks/indexedDB/participant/clearAllParticipants";
import TabActionButton from "~/ui/ControlPanelUI/TabActionButton/_main/TabActionButton";

type ClearAllParticipantsButtonPropsTypes = {
  openModal: React.Dispatch<React.SetStateAction<boolean>>;
};

const ClearAllPaticipantsButton = ({
  openModal
}: ClearAllParticipantsButtonPropsTypes) => {
  const [withParticipantsData, setWithParticipantsData] = useLocalStorageState(
    "withParticipantsData",
    { defaultValue: false }
  );

  const handleOpenModal = () => {
    openModal(true);
  };

  const [clearParticipantsLoading, setClearParticipantsLoading] =
    useLocalStorageState("clearParticipantsLoading", { defaultValue: false });

  return (
    <>
      <TabActionButton onClick={handleOpenModal}>
        Clear All Participants
      </TabActionButton>
    </>
  );
};

export default ClearAllPaticipantsButton;
