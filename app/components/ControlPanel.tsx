import React from "react";

interface ControlPanelProps {
  controlPanelOpen: boolean;
}

const ControlPanel: React.FC<ControlPanelProps> = ({ controlPanelOpen }) => {
  return (
    <aside
      className={`side-panel bg-gray-800 w-[400px] flex flex-col text-white ${
        controlPanelOpen ? "display-block" : "hidden"
      }`}
    >
      <div className="control-panel-nav text-sm flex justify-between items-center ">
        <button className="active">
          <div className="button-icon">O</div>
          <div className="button-label">Overview</div>{" "}
        </button>
        <button>
          <div className="button-icon">O</div>
          <div className="button-label">Raffle</div>{" "}
        </button>
        <button>
          <div className="button-icon">O</div>
          <div className="button-label">Presentation</div>{" "}
        </button>
        <button>
          <div className="button-icon">O</div>
          <div className="button-label">Configure</div>{" "}
        </button>
      </div>
      <div className="top-part grow p-4 overflow-y-scroll bg-gradient-to-b from-gray-900 to-gray-800">
        <div className="sub-panel mb-3">
          <h2 className="mb-2">Choose Views</h2>
          <div className="view-options grid grid-cols-2 gap-2">
            <div className="view-option bg-orange-200  rounded-md aspect-video flex justify-center items-end text-sm">
              <a href="/main/characters">Raffle Winner</a>
            </div>
            <div className="view-option bg-orange-200 rounded-md aspect-video flex justify-center items-end text-sm">
              <a href="/main/characters">Background Only</a>
            </div>
            <div className="view-option bg-orange-200 rounded-md aspect-video flex justify-center items-end text-sm">
              <a href="/main/characters" className="text-center">
                StandBy <br /> (Before Draw)
              </a>
            </div>
            <div className="view-option bg-orange-200 rounded-md aspect-video flex justify-center items-end text-sm center">
              <a href="/main/characters" className="text-center">
                Participants <br /> Overview
              </a>
            </div>
          </div>
        </div>
        <div className="sub-panel mb-3">
          <h2 className="mb-2">Presentation Preview</h2>
          <div className="view-options grid \ gap-2">
            <div className="view-option bg-orange-200  rounded-md aspect-video flex justify-center items-end text-sm">
              <a href="/main/characters">Raffle Winner</a>
            </div>
          </div>
        </div>
      </div>
      <div className="bottom-part flex justify-between items-center  p-4">
        <button className="bg-green-600 hover:bg-green-500 px-4 h-[40px] rounded-lg cursor-pointer">
          Cancel Winner
        </button>
        <button className="bg-green-600 hover:bg-green-500  px-4 h-[40px] rounded-lg cursor-pointer">
          Draw Raffle
        </button>
      </div>
    </aside>
  );
};

export default ControlPanel;
