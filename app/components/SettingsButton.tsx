import { useState } from "react";

const SettingsButton = () => {
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);

  const toggleSettingsModal = () => {
    setSettingsModalOpen((prev) => !prev);
  };
  return (
    <div className="settings-button">
      <button onClick={toggleSettingsModal}>Settings</button>
      <div
        className={`settings-modal h-full w-full absolute top-0 left-0 bg-[rgba(0,0,0,0.4)] shadow-lg p-4 z-50 ${
          settingsModalOpen ? "block" : "hidden"
        }`}
      >
        <div className="modal-content absolute top-1/2 left-1/2 bg-white rounded-lg p-4 transform -translate-x-1/2 -translate-y-1/2 h-3/4 min-w-[800px] text-black flex flex-col">
          <div className="modal-header flex justify-between items-center">
            <h1>Settings Modal</h1>
            <button
              className="exit-button h-8 aspect-square text-white font-bold bg-amber-800 rounded-full cursor-pointer hover:bg-amber-700"
              onClick={toggleSettingsModal}
            >
              X
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
