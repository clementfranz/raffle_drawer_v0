import React, { useState } from "react";

interface Tab_OverviewProps {
  setIsPresenting?: React.Dispatch<React.SetStateAction<boolean>>;
  isPresenting?: boolean;
}

import UploadParticipants from "../components/UploadParticipants/UploadParticipants";

const Tab_Overview: React.FC<Tab_OverviewProps> = ({
  setIsPresenting,
  isPresenting
}) => {
  const [withParticipants, setWithParticipants] = useState(false);

  return (
    <>
      <div className="top-part grow p-4 overflow-y-scroll bg-gradient-to-b from-gray-900 to-gray-800">
        <div className="sub-panel mb-3">
          <h2 className="mb-2">Participants Overview</h2>
          {withParticipants ? (
            <p>Participants List Summary</p>
          ) : (
            <UploadParticipants uploadComplete={setWithParticipants} />
          )}
        </div>
        <div className="sub-panel mb-3">
          <h2 className="mb-2">Regional Total:</h2>
          <ul className="text-gray-300 text-sm flex flex-col gap-2">
            <ol>Luzon</ol>
            <ol>Vizayas</ol>
            <ol>Mindanao</ol>
          </ul>
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
    </>
  );
};

export default Tab_Overview;
