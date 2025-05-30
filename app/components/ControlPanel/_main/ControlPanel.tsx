import React, { useState } from "react";

interface ControlPanelProps {
  controlPanelOpen: boolean;
  setIsPresenting?: React.Dispatch<React.SetStateAction<boolean>>;
  isPresenting?: boolean;
}

import PresenterControls from "../../PresenterControls/PresenterControls";
import ControlPanelNav from "../../ControlPanelNav/ControlPanelNav";

import Tab_Overview from "../../ControlPanelTabs/Tab_Overview/_main/Tab_Overview";
import Tab_Raffle from "../../ControlPanelTabs/Tab_Raffle/_main/Tab_Raffle";
import Tab_Presentation from "../../ControlPanelTabs/Tab_Presentation/_main/Tab_Presentation";
import Tab_Configure from "../../ControlPanelTabs/Tab_Configure/_main/Tab_Configure";

const ControlPanel: React.FC<ControlPanelProps> = ({
  controlPanelOpen,
  setIsPresenting,
  isPresenting
}) => {
  const [activeTab, setActiveTab] = useState("overview");
  const [isRaffleDrawReady, setIsRaffleDrawReady] = useState(false);

  return (
    <aside
      className={`side-panel bg-gray-800 flex flex-col text-white relative transition-all duration-300 ${
        controlPanelOpen ? "translate-x-0  w-[400px]" : "translate-x-full w-0"
      }`}
    >
      <div className="inherit flex flex-col  w-[400px] h-full">
        <PresenterControls
          isPresenting={isPresenting}
          setIsPresenting={setIsPresenting}
        />
        <ControlPanelNav setActiveTab={setActiveTab} activeTab={activeTab} />
        <Tab_Overview
          setIsPresenting={setIsPresenting}
          isPresenting={isPresenting}
          isActiveTab={activeTab === "overview"}
        />
        <Tab_Raffle isActiveTab={activeTab === "raffle"} />
        <Tab_Presentation isActiveTab={activeTab === "presentation"} />
        <Tab_Configure isActiveTab={activeTab === "configure"} />
      </div>
    </aside>
  );
};

export default ControlPanel;
