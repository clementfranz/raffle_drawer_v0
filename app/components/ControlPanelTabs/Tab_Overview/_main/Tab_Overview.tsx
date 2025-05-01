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

const Tab_Overview: React.FC<Tab_OverviewProps> = ({
  setIsPresenting,
  isPresenting,
  isActiveTab
}) => {
  const [withParticipants, setWithParticipants] = useState(false);

  return (
    <TabMainBody isActive={isActiveTab}>
      <TabShell position="top">
        <TabSubPanel title={"Participants Overview"}>
          {withParticipants ? (
            <ParticipantsListSummary />
          ) : (
            <UploadParticipants uploadComplete={setWithParticipants} />
          )}
        </TabSubPanel>
      </TabShell>
      <TabShell position="bottom">
        <TabActionButton>Present Summary</TabActionButton>
        <TabActionButton>Prepare Raffle</TabActionButton>
      </TabShell>
    </TabMainBody>
  );
};

export default Tab_Overview;
