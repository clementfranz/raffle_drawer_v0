import React, { useState } from "react";

interface InfinityRollReelProps {
  setActiveTab: React.Dispatch<React.SetStateAction<string>>;
  activeTab: string;
}

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faShapes,
  faTicket,
  faChalkboard,
  faSliders
} from "@fortawesome/free-solid-svg-icons";

const ControlPanelNav: React.FC<InfinityRollReelProps> = ({
  setActiveTab,
  activeTab
}) => {
  return (
    <>
      <div className="control-panel-nav text-sm flex justify-between items-center ">
        <button
          className={`${activeTab === "overview" ? "active" : ""}`}
          onClick={() => setActiveTab("overview")}
        >
          <div className="button-icon">
            <FontAwesomeIcon icon={faShapes} className="text-2xl text-white" />
          </div>
          <div className="button-label">Overview</div>{" "}
        </button>
        <button
          className={`${activeTab === "raffle" ? "active" : ""}`}
          onClick={() => setActiveTab("raffle")}
        >
          <div className="button-icon">
            <FontAwesomeIcon icon={faTicket} className="text-2xl text-white" />
          </div>
          <div className="button-label">Raffle</div>{" "}
        </button>
        <button
          className={`${activeTab === "presentation" ? "active" : ""}`}
          onClick={() => setActiveTab("presentation")}
        >
          <div className="button-icon">
            <FontAwesomeIcon
              icon={faChalkboard}
              className="text-2xl text-white"
            />
          </div>
          <div className="button-label">Presentation</div>{" "}
        </button>
        <button
          className={`${activeTab === "configure" ? "active" : ""}`}
          onClick={() => setActiveTab("configure")}
        >
          <div className="button-icon">
            <FontAwesomeIcon icon={faSliders} className="text-2xl text-white" />
          </div>
          <div className="button-label">Configure</div>{" "}
        </button>
      </div>
    </>
  );
};

export default ControlPanelNav;
