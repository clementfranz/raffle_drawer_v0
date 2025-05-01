import React from "react";

import StartDrawButton from "../components/StartDrawButton";

// UI Components
// UI Components
import TabMainBody from "~/ui/ControlPanelUI/TabMainBody/_main/TabMainBody";
import TabShell from "~/ui/ControlPanelUI/TabShell/_main/TabShell";
import TabSubPanel from "~/ui/ControlPanelUI/TabSubPanel/_main/TabSubPanel";
import TabActionButton from "~/ui/ControlPanelUI/TabActionButton/_main/TabActionButton";

interface Tab_RaffleProps {
  isActiveTab?: boolean;
}

const Tab_Raffle: React.FC<Tab_RaffleProps> = ({ isActiveTab }) => {
  return (
    <>
      <TabMainBody isActive={isActiveTab}>
        <TabShell position="top">
          <TabSubPanel title={"Raffle Draw"}>
            <div className="raffle-draw-status bg-gray-950 w-full rounded-xl h-[80px] border-gray-600 border-2 flex items-center justify-center text-xl font-[courier] font-bold text-amber-200 text-shadow-amber-500 text-shadow-md ">
              Not Started Yet
            </div>
          </TabSubPanel>
          <TabSubPanel title={"Winner"} className="gap-3 flex flex-col">
            <div className="grid w-full">
              <div className="participant-card text-sm w-full bg-gray-700 p-3 rounded-xl ">
                <div className="participant-name text-xl">Juan Dela Cruz</div>
                <div className="participant-details flex w-full justify-between">
                  <div className="participant-location">North Luzon</div>
                  <div className="participant-code font-[courier] font-bold tracking-widest">
                    KOPIKOBLANCA
                  </div>
                </div>
              </div>
            </div>
          </TabSubPanel>
          <TabSubPanel title={"Backup Winners"} className="gap-3 flex flex-col">
            <div className="grid w-full gap-3">
              <div className="participant-card text-sm w-full bg-gray-700 p-3 rounded-xl ">
                <div className="participant-name text-xl">Juan Dela Cruz</div>
                <div className="participant-details flex w-full justify-between">
                  <div className="participant-location">North Luzon</div>
                  <div className="participant-code font-[courier] font-bold tracking-widest">
                    KOPIKOBLANCA
                  </div>
                </div>
              </div>
              <div className="participant-card text-sm w-full bg-gray-700 p-3 rounded-xl ">
                <div className="participant-name text-xl">Juan Dela Cruz</div>
                <div className="participant-details flex w-full justify-between">
                  <div className="participant-location">North Luzon</div>
                  <div className="participant-code font-[courier] font-bold tracking-widest">
                    KOPIKOBLANCA
                  </div>
                </div>
              </div>
            </div>
          </TabSubPanel>
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
