import { useState } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

const SettingsButton = () => {
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);

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
          <div className="modal-body grow"></div>
          <div className="modal-footer text-right text-sm italic">
            Last System Update: April 25, 2025 at 9:00 AM
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsButton;
