import React from "react";

interface Tab_OverviewProps {
  setIsPresenting?: React.Dispatch<React.SetStateAction<boolean>>;
  isPresenting?: boolean;
}

const Tab_Overview: React.FC<Tab_OverviewProps> = ({
  setIsPresenting,
  isPresenting
}) => {
  const startPresentation = () => {
    if (setIsPresenting) {
      setIsPresenting(true);
    }
    window.open(
      "/present",
      "_blank",
      "width=1300,height=600,noopener,noreferrer"
    );
  };

  return (
    <>
      <div className="top-part grow p-4 overflow-y-scroll bg-gradient-to-b from-gray-900 to-gray-800">
        <div className="sub-panel mb-3">
          <h2 className="mb-2">Participants List Summary</h2>
        </div>
        <div className="sub-panel mb-3">
          <h2 className="mb-2">Regional </h2>
          <div className="view-options grid \ gap-2">
            <div className="view-option bg-orange-200  rounded-md aspect-video flex justify-center items-end text-sm">
              <a href="/main/characters">Raffle Winner</a>
            </div>
          </div>
        </div>
      </div>
      <div className="bottom-part flex justify-between items-center text-sm p-4">
        <button className="bg-gray-600 hover:bg-gray-500 px-4 h-[40px] rounded-2xl cursor-pointer">
          Present Summary
        </button>
        <button className="bg-gray-600 hover:bg-gray-500  px-4 h-[40px] rounded-2xl cursor-pointer">
          Prepare Raffle
        </button>
      </div>
      {!isPresenting && (
        <div className="alert-div absolute bg-[#0000009d] w-full h-full grid place-items-center">
          <div className="modal-shell bg-white w-[300px] h-[200px] rounded-2xl flex flex-col justify-center items-center">
            <div className="modal-content text-black p-6 text-sm text-center flex flex-col justify-between h-full">
              <div className="top">
                <p className="mb-2">
                  You are about to open a new window for presentation
                </p>

                <p className="mb-2">Are you sure you want to proceed?</p>
              </div>
              <div className="bottom">
                <button
                  className="bg-[#a50e25] text-white p-2 px-4 rounded-2xl cursor-pointer hover:bg-[#7d0b1c]"
                  onClick={startPresentation}
                >
                  Start Presentation
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Tab_Overview;
