import React, { useState } from "react";

// UI Components
import TabMainBody from "~/ui/ControlPanelUI/TabMainBody/_main/TabMainBody";
import TabShell from "~/ui/ControlPanelUI/TabShell/_main/TabShell";
import TabSubPanel from "~/ui/ControlPanelUI/TabSubPanel/_main/TabSubPanel";
import TabActionButton from "~/ui/ControlPanelUI/TabActionButton/_main/TabActionButton";
import { pickRandomParticipant } from "~/hooks/indexedDB/_main/useIndexedDB";
import { addWinnerParticipant } from "~/hooks/indexedDB/winnerParticipant/addWinnerParticipant";

interface Tab_ConfigureProps {
  isActiveTab?: boolean;
}

const Tab_Configure: React.FC<Tab_ConfigureProps> = ({ isActiveTab }) => {
  const [randomParticipant, setRandomParticipant] = useState<any>(null);

  const saveWinnerParticipant = async (
    participant: any,
    winnerType: "primary" | "backup"
  ) => {
    const saveSuccess = await addWinnerParticipant(participant, winnerType);
    if (saveSuccess) {
      console.log(
        "Success saving winner: ",
        participant.full_name,
        " with winner type of ",
        winnerType
      );
    }
  };

  const handlePickRandomParticipant = async (
    winnerType: "primary" | "backup" = "primary",
    region?: string | null
  ) => {
    console.log("Picking Random Participant");
    const participant = await pickRandomParticipant(region ?? undefined);
    if (participant) {
      setRandomParticipant(participant);
      saveWinnerParticipant(participant, winnerType);
      console.log(participant);
    }
  };

  return (
    <TabMainBody isActive={isActiveTab}>
      <TabShell position="top">
        <TabSubPanel title={"Regional Picking Parameter"}>
          <p className="text-sm">Choose Region to choose winner from</p>
          <label htmlFor="region-select" className="block text-sm font-medium">
            Select Region
          </label>
          <select
            name="region-select"
            id="region-select"
            className="w-full bg-gray-600 p-2 mt-2 rounded-2xl"
          >
            <option value="">All Regions</option>
            <option value="">North Luzon</option>
            <option value="">Central Luzon</option>
            <option value="">Southern Luzon</option>
            <option value="">Visayas</option>
            <option value="">Mindanao</option>
          </select>
          <p className="text-sm mt-1 italic mb-4">
            Resets to 'all regions' every restart of application.
          </p>
          <div className="button-bar flex justify-end">
            <TabActionButton className="self-end ml-auto text-sm px-2">
              Apply
            </TabActionButton>
          </div>
        </TabSubPanel>
        <TabSubPanel title={"Testing Buttons"}>
          <div className="button-bar flex justify-end">
            <TabActionButton
              className="self-end ml-auto text-sm px-2"
              onClick={handlePickRandomParticipant}
            >
              Pick Random Participant
            </TabActionButton>
            <p>Random Participant Picked: {}</p>
          </div>
        </TabSubPanel>
      </TabShell>
      <TabShell position="bottom">
        <TabActionButton>Present Summary</TabActionButton>
        <TabActionButton>Prepare Raffle</TabActionButton>
      </TabShell>
    </TabMainBody>
  );
};

export default Tab_Configure;
