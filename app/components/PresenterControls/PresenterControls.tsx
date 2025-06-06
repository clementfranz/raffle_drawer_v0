import React from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPause } from "@fortawesome/free-solid-svg-icons";
import useLocalStorageState from "use-local-storage-state";

interface PresenterControlsProps {
  setIsPresenting?: React.Dispatch<React.SetStateAction<boolean>>;
  isPresenting?: boolean;
}

const PresenterControls: React.FC<PresenterControlsProps> = ({
  isPresenting,
  setIsPresenting
}) => {
  type PresentingStatus = "presenting" | "not-presenting";

  const [isServerActive] = useLocalStorageState<boolean>("isServerActive");

  const [presentingStatus, setIsPresentingStatus] =
    useLocalStorageState<PresentingStatus>("presentingStatus");

  const [startDraw, setStartDraw] = useLocalStorageState("startDraw", {
    defaultValue: false
  });

  const [cloudSyncModalOpen, setCloudSyncModalOpen] =
    useLocalStorageState<boolean>("cloudSyncModalOpen", {
      defaultValue: false
    });

  const [activeSyncsTotal, setActiveSyncsTotal] = useLocalStorageState<number>(
    "activeSyncsTotal",
    { defaultValue: 0 }
  );

  const handleToggleSyncModal = () => {
    setCloudSyncModalOpen((prev) => {
      return !prev;
    });
  };

  const togglePresentation = () => {
    if (presentingStatus === "presenting") {
      setIsPresentingStatus("not-presenting");
    } else {
      setIsPresentingStatus("presenting");
      window.open(
        "/presenter",
        "_blank",
        "width=1300,height=600,noopener,noreferrer"
      );
      setStartDraw(false);
    }
  };
  return (
    <>
      <div className="presenter-controls h-[60px] bg-gray-900 flex justify-between items-center px-3 border-b-1 border-b-gray-600">
        <button
          className={`present-button py-2 px-3 text-sm rounded-xl cursor-pointer ${
            isPresenting
              ? " bg-red-800 hover:bg-red-700"
              : "bg-blue-800 hover:bg-blue-700"
          }`}
          onClick={togglePresentation}
          type="button"
          aria-label="Start Presentation"
        >
          {isPresenting ? "Stop Presentation" : "Start Presentation"}
        </button>
        {/* <button
          className="pause-presentation bg-red-950 h-[40px] aspect-square rounded-2xl text-gray-300 text-base flex items-center justify-center hover:bg-red-800 cursor-pointer"
          aria-label="Pause Presentation"
        >
          <FontAwesomeIcon icon={faPause} className="" />
        </button> */}
        <button
          className={`pause-presentation h-[40px] text-sm px-3 rounded-2xl  flex items-center justify-center cursor-pointer relative ${
            isServerActive
              ? "bg-emerald-400 hover:bg-emerald-500 animate-pulse text-emerald-800 font-bold"
              : "bg-red-800 hover:bg-red-700 text-red-200"
          }`}
          aria-label="Server Control"
          onClick={handleToggleSyncModal}
        >
          {isServerActive ? "Server Online" : "Server Offline"}
          {isServerActive && activeSyncsTotal > 0 && (
            <div className="number-ball absolute bg-amber-100 text-black text-[12px] font-bold h-[18px] flex justify-center items-center aspect-square rounded-full top-0 right-0 -translate-y-1/4 translate-x-1/4">
              {activeSyncsTotal}
            </div>
          )}
        </button>
      </div>
    </>
  );
};

export default PresenterControls;
