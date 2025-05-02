import { useState } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

import { latestUpdateData } from "~/data/latestUpdateData";

const SettingsButton = () => {
  const [settingsModalOpen, setSettingsModalOpen] = useState(true);

  const toggleSettingsModal = () => {
    setSettingsModalOpen((prev) => !prev);
  };
  return (
    <div className="settings-button">
      <button
        onClick={toggleSettingsModal}
        className="px-4 py-2 hover:bg-[#7d0b1c] rounded-full cursor-pointer"
      >
        Settings
      </button>
      <div
        className={`settings-modal h-full w-full absolute top-0 left-0 bg-[rgba(0,0,0,0.4)] shadow-lg p-4 z-50 ${
          settingsModalOpen ? "flex" : "hidden"
        }`}
      >
        <div
          className={`modal-content absolute top-1/2 left-1/2 bg-white rounded-lg p-4 transform -translate-x-1/2 -translate-y-1/2 h-3/4 min-w-[800px] text-black flex flex-col `}
        >
          <div className="modal-header flex justify-between items-center">
            <h1>Settings Modal</h1>
            <button
              type="button"
              className="exit-button h-[40px] aspect-square text-white font-bold bg-gray-800 rounded-full cursor-pointer hover:bg-gray-700 flex items-center justify-center  transition-all duration-200 ease-in-out"
              onClick={toggleSettingsModal}
              aria-label="Close Modal"
            >
              <FontAwesomeIcon icon={faXmark} className="text-2xl" />
            </button>
          </div>
          <div className="modal-body grow">
            <div className="progress-bar my-4 w-full bg-gray-700 h-[50px] rounded-full p-2">
              <div className="progress-fill bg-emerald-500 w-[90%] h-full rounded-full flex justify-center items-center animate-pulse">
                90%
              </div>
            </div>
            <h1>Work In Progress (Remaining Issues Only)</h1>

            <ul>
              <li>✅ Integration of Participants Data to Table</li>
              <li>✅ Raffle Draw Randomizer Algorithm</li>
              <li>✅ Raffle Draw View Polishing</li>
              <li>✅ Picking for Final Winner</li>
              <li>⏳ Cancelling for Final Winner</li>
              <li>⏳ Participants Summary View Polishing</li>
              <li>⏹️ Presentation View Switching</li>
            </ul>
            <p className="mt-4 text-sm">Legend:</p>
            <p className="text-sm w-full  gap-4 flex">
              <span>⏹️ Not Startet Yet</span>
              <span>⏳ Work In Progress</span>
              <span>🔴 Fixing Problem</span>
              <span>✅ Feature Done</span>
            </p>
          </div>
          <div className="modal-footer text-right text-sm italic">
            Last System Update: {latestUpdateData}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsButton;
