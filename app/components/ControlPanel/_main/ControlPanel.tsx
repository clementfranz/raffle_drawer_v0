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
import Tab_Presentation from "../../ControlPanelTabs/Tab_Presentation";
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
      className={`side-panel bg-gray-800 w-[400px]  flex-col text-white relative ${
        controlPanelOpen ? "flex" : "hidden"
      }`}
    >
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
    </aside>
  );
};

export default ControlPanel;
