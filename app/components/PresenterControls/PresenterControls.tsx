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

  const [presentingStatus, setIsPresentingStatus] =
    useLocalStorageState<PresentingStatus>("presentingStatus");

  const [startDraw, setStartDraw] = useLocalStorageState("startDraw", {
    defaultValue: false
  });

  const togglePresentation = () => {
    if (presentingStatus === "presenting") {
      setIsPresentingStatus("not-presenting");
    } else {
      setIsPresentingStatus("presenting");
      window.open(
        "/present",
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
        <button
          className="pause-presentation bg-red-950 h-[40px] aspect-square rounded-2xl text-gray-300 text-base flex items-center justify-center hover:bg-red-800 cursor-pointer"
          aria-label="Pause Presentation"
        >
          <FontAwesomeIcon icon={faPause} className="" />
        </button>
      </div>
    </>
  );
};

export default PresenterControls;
