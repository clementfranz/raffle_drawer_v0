import React from "react";

import StartDrawButton from "../components/StartDrawButton";

// UI Components
// UI Components
import TabMainBody from "~/ui/ControlPanelUI/TabMainBody/_main/TabMainBody";
import TabShell from "~/ui/ControlPanelUI/TabShell/_main/TabShell";
import TabSubPanel from "~/ui/ControlPanelUI/TabSubPanel/_main/TabSubPanel";
import TabActionButton from "~/ui/ControlPanelUI/TabActionButton/_main/TabActionButton";
import useLocalStorageState from "use-local-storage-state";

interface Tab_RaffleProps {
  isActiveTab?: boolean;
}

const Tab_Raffle: React.FC<Tab_RaffleProps> = ({ isActiveTab }) => {
  const [winners, setWinners] = useLocalStorageState<any[] | null>("winners");

  return (
    <>
      <TabMainBody isActive={isActiveTab}>
        <TabShell position="top">
          <TabSubPanel title={"Raffle Draw"}>
            <div className="raffle-draw-status bg-gray-950 w-full rounded-xl h-[80px] border-gray-600 border-2 flex items-center justify-center text-xl font-[courier] font-bold text-amber-200 text-shadow-amber-500 text-shadow-md ">
              Not Started Yet
            </div>
          </TabSubPanel>
          {winners && winners.length > 0 && (
            <TabSubPanel title={"Winner"} className="gap-3 flex flex-col">
              <div className="grid w-full">
                <div className="participant-card text-sm w-full bg-gray-700 p-3 rounded-xl ">
                  <div className="participant-name text-xl">
                    {winners[0]?.full_name}
                  </div>
                  <div className="participant-details flex w-full justify-between">
                    <div className="participant-location">
                      {winners[0].regional_location}
                    </div>
                    <div className="participant-code font-[courier] font-bold tracking-widest">
                      {winners[0].raffle_code}
                    </div>
                  </div>
                </div>
              </div>
            </TabSubPanel>
          )}
          {winners && winners.length > 0 && (
            <TabSubPanel
              title={"Backup Winners"}
              className="gap-3 flex flex-col"
            >
              <div className="grid w-full gap-3">
                <div className="participant-card text-sm w-full bg-gray-700 p-3 rounded-xl ">
                  <div className="participant-name text-xl">
                    {winners[1]?.full_name}
                  </div>
                  <div className="participant-details flex w-full justify-between">
                    <div className="participant-location">
                      {winners[1].regional_location}
                    </div>
                    <div className="participant-code font-[courier] font-bold tracking-widest">
                      {winners[1].raffle_code}
                    </div>
                  </div>
                </div>
              </div>
              <div className="grid w-full gap-3">
                <div className="participant-card text-sm w-full bg-gray-700 p-3 rounded-xl ">
                  <div className="participant-name text-xl">
                    {winners[2]?.full_name}
                  </div>
                  <div className="participant-details flex w-full justify-between">
                    <div className="participant-location">
                      {winners[2].regional_location}
                    </div>
                    <div className="participant-code font-[courier] font-bold tracking-widest">
                      {winners[2].raffle_code}
                    </div>
                  </div>
                </div>
              </div>
            </TabSubPanel>
          )}
          <TabSubPanel title="Proclaimed Winner"></TabSubPanel>
        </TabShell>
        <TabShell position="bottom">
          {/* <TabActionButton>Present Summary</TabActionButton> */}
          <StartDrawButton />
        </TabShell>
      </TabMainBody>
    </>
  );
};

export default Tab_Raffle;
