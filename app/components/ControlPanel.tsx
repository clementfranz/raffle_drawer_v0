import React, { useState } from "react";

interface ControlPanelProps {
  controlPanelOpen: boolean;
  setIsPresenting?: React.Dispatch<React.SetStateAction<boolean>>;
  isPresenting?: boolean;
}

import ControlPanelNav from "./ControlPanelNav/ControlPanelNav";

import Tab_Overview from "./ControlPanelTabs/Tab_Overview";
import Tab_Raffle from "./ControlPanelTabs/Tab_Raffle";
import Tab_Presentation from "./ControlPanelTabs/Tab_Presentation";
import Tab_Configure from "./ControlPanelTabs/Tab_Configure";

const ControlPanel: React.FC<ControlPanelProps> = ({
  controlPanelOpen,
  setIsPresenting,
  isPresenting
}) => {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <aside
      className={`side-panel bg-gray-800 w-[400px] flex flex-col text-white relative ${
        controlPanelOpen ? "display-block" : "hidden"
      }`}
    >
      <ControlPanelNav setActiveTab={setActiveTab} activeTab={activeTab} />
      {activeTab === "overview" && (
        <Tab_Overview
          setIsPresenting={setIsPresenting}
          isPresenting={isPresenting}
        />
      )}
      {activeTab === "raffle" && <Tab_Raffle />}
      {activeTab === "presentation" && <Tab_Presentation />}
      {activeTab === "configure" && <Tab_Configure />}
    </aside>
  );
};

export default ControlPanel;
