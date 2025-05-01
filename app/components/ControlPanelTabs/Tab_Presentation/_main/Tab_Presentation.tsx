import React from "react";

// UI Components
import TabMainBody from "~/ui/ControlPanelUI/TabMainBody/_main/TabMainBody";
import TabShell from "~/ui/ControlPanelUI/TabShell/_main/TabShell";
import TabSubPanel from "~/ui/ControlPanelUI/TabSubPanel/_main/TabSubPanel";
import TabActionButton from "~/ui/ControlPanelUI/TabActionButton/_main/TabActionButton";
import useLocalStorageState from "use-local-storage-state";

interface Tab_PresentationProps {
  isActiveTab?: boolean;
}

const Tab_Presentation: React.FC<Tab_PresentationProps> = ({ isActiveTab }) => {
  const [presentingView, setPresentingView] =
    useLocalStorageState("presentingView");

  return (
    <>
      <TabMainBody isActive={isActiveTab}>
        <TabShell position="top">
          <TabSubPanel title="Presentation Preview">
            <div className="view-options flex  gap-2 justify-center w-full">
              <div className="view-preview  rounded-md aspect-video flex justify-center items-end text-sm  w-[80%]">
                <div className="label">Raffle Winner</div>
              </div>
            </div>
          </TabSubPanel>
          <TabSubPanel title={"Choose Views"}>
            <div className="view-options grid grid-cols-2 gap-2">
              <div className="view-option bg-orange-200  rounded-md aspect-video flex justify-center items-end text-sm">
                <div className="label">Raffle Winner</div>
              </div>
              <div className="view-option bg-orange-200 rounded-md aspect-video flex justify-center items-end text-sm">
                <div className="label">Background Only</div>
              </div>
              <div className="view-option bg-orange-200 rounded-md aspect-video flex justify-center items-end text-sm">
                <div className="label">
                  StandBy <br /> (Before Draw)
                </div>
              </div>
              <div className="view-option bg-orange-200 rounded-md aspect-video flex justify-center items-end text-sm center">
                <div className="label">
                  Participants <br /> Overview
                </div>
              </div>
            </div>
          </TabSubPanel>
        </TabShell>
        <TabShell position="bottom">
          <TabActionButton>Pause Presentation</TabActionButton>
        </TabShell>
      </TabMainBody>
    </>
  );
};

export default Tab_Presentation;
