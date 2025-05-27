import React, { useState } from "react";

// UI Components
import TabMainBody from "~/ui/ControlPanelUI/TabMainBody/_main/TabMainBody";
import TabShell from "~/ui/ControlPanelUI/TabShell/_main/TabShell";
import TabSubPanel from "~/ui/ControlPanelUI/TabSubPanel/_main/TabSubPanel";
import TabActionButton from "~/ui/ControlPanelUI/TabActionButton/_main/TabActionButton";
import { pickRandomParticipant } from "~/hooks/indexedDB/_main/useIndexedDB";
import { addWinnerParticipant } from "~/hooks/indexedDB/winnerParticipant/addWinnerParticipant";
import useLocalStorageState from "use-local-storage-state";
import ExportWinnerData from "../components/SubPanels/ExportWinnerData/ExportWinnerData";

interface Tab_ConfigureProps {
  isActiveTab?: boolean;
}

type RegionalStat = {
  regions: {
    location: string;
  }[];
};

const Tab_Configure: React.FC<Tab_ConfigureProps> = ({ isActiveTab }) => {
  const [randomParticipant, setRandomParticipant] = useState<any>(null);

  const [isServerActive, setIsServerActive] = useLocalStorageState<boolean>(
    "isServerActive",
    { defaultValue: true }
  );

  const [regionalStats] = useLocalStorageState<RegionalStat>("regionalStats");
  const [favoredRegion, setFavoredRegion] = useLocalStorageState<
    string | undefined
  >("favoredRegion", { defaultValue: undefined });

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

  const handleApplyFavoredRegion = (
    e: React.ChangeEvent<HTMLSelectElement>,
    setFavoredRegion: (value: string | undefined) => void
  ) => {
    const value = e.target.value;
    setFavoredRegion(value === "undefined" ? undefined : value);
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
          {regionalStats &&
          regionalStats?.regions.length > 0 &&
          isServerActive ? (
            <>
              <label
                htmlFor="region-select"
                className="block text-sm font-medium"
              >
                Select Region
              </label>
              <select
                name="region-select"
                id="region-select"
                className="w-full bg-gray-600 p-2 mt-2 rounded-2xl"
                value={favoredRegion ?? "undefined"}
                onChange={(e) => handleApplyFavoredRegion(e, setFavoredRegion)}
              >
                <option value="undefined">National (Whole Philippines)</option>
                {regionalStats?.regions.map((stat, index) => (
                  <option
                    key={index}
                    value={stat.location}
                    className="capitalize first-letter:uppercase"
                  >
                    {stat.location}
                  </option>
                ))}
              </select>
              <p className="text-sm mt-1 italic mb-4">
                Resets to 'all regions' every restart of application.
              </p>
              <div className="mt-5 p-3 rounded-2xl bg-blue-800 text-white">
                <div className="text-sm">Confirmed Favored Location: </div>
                <div className="text-lg">
                  {favoredRegion ?? "National (Whole Philippines)"}
                </div>
              </div>
              {/* <div className="button-bar flex justify-end">
                <TabActionButton className="self-end ml-auto text-sm px-2">
                  Apply
                </TabActionButton>
              </div> */}
            </>
          ) : !isServerActive ? (
            <>
              <div className="mt-6 text-red-400 text-balance">
                Please start server to enable regional picking.
              </div>
            </>
          ) : (
            <div className="mt-6 text-red-400">
              No data available for regional stats
            </div>
          )}
        </TabSubPanel>
        <ExportWinnerData />
        <TabSubPanel title={"Testing Buttons"} className="hidden">
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
      {/* <TabShell position="bottom">
        <TabActionButton>Present Summary</TabActionButton>
        <TabActionButton>Prepare Raffle</TabActionButton>
      </TabShell> */}
    </TabMainBody>
  );
};

export default Tab_Configure;
