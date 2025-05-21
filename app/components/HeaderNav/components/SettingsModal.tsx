import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { latestUpdateData } from "~/data/latestUpdateData";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SettingsModal = ({ isOpen, onClose }: SettingsModalProps) => {
  if (!isOpen) return null; // no rendering when closed

  return (
    <div className="fixed inset-0 bg-[rgba(0,0,0,0.4)] z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-4 h-3/4 min-w-[800px] text-black flex flex-col relative">
        <div className="flex justify-between items-center">
          <h1 className="flex flex-col">
            Settings Modal{" "}
            <span className="text-2xl font-bold">
              {" "}
              ⭕🔴⭕ PLEASE READ LATEST UPDATES ⭕🔴⭕
            </span>
          </h1>
          <button
            onClick={onClose}
            aria-label="Close Modal"
            className="exit-button h-[40px] aspect-square text-white font-bold bg-gray-800 rounded-full cursor-pointer hover:bg-gray-700 flex items-center justify-center transition-all duration-200 ease-in-out absolute top-4 right-4"
          >
            <FontAwesomeIcon icon={faXmark} className="text-2xl" />
          </button>
        </div>

        <div className="grow overflow-y-auto mt-4">
          <div className="progress-bar my-4 w-full bg-gray-700 h-[50px] rounded-full p-2">
            <div className="progress-fill bg-emerald-500 w-[33%] h-full rounded-full flex justify-center items-center animate-pulse">
              33%
            </div>
          </div>
          <h1>New Fixes</h1>
          <ul className="ml-4 mb-4">
            <li>
              ⭐ User Authentication to Prevent Unautorized Access on Cloud
            </li>
            <li>⭐ Restructured Header Buttons</li>
          </ul>
          <h1>Work In Progress (Remaining Issues Only)</h1>
          <ul className=" ml-4">
            <li>
              🔴 Conflicting Bugs for Winners Downsync Controllers (API
              Structure Issue){" "}
            </li>
            <li>
              🔴 Enabling of API Access on CPanel Deployment (Restructuring
              in-progress)
            </li>
            <li>⏳ Pagination Issues</li>
            <li>⏹️ White Listing of Email Accounts</li>
          </ul>

          <div className="mt-4 text-sm">
            <p>Legend:</p>
            <div className="flex gap-4 flex-wrap">
              <span>⏹️ Not Started Yet</span>
              <span>⏳ Work In Progress</span>
              <span>🔴 Fixing Problem</span>
              <span>✅ Feature Done</span>
              <span>⭐ New Feature</span>
            </div>
          </div>
          <h1 className="text-emerald-900 mt-5">
            Estimated Time of Completion:{" "}
            <b className=" animate-pulse">
              5:00 PM - 2025-05-21 (Today) [add 1 hour allowance]
            </b>
          </h1>
        </div>

        <div className="modal-footer text-right text-sm italic mt-4">
          Last System Update: {latestUpdateData}
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
