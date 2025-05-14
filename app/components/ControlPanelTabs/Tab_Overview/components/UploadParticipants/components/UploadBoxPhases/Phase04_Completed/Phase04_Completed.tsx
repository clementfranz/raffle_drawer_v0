import React, { useEffect, useState } from "react";

// Components
import UploadBox from "../../UploadBox/_main/UploadBox";
import UploadButton from "../../UploadButton/_main/UploadButton";

// Custom Icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileCsv } from "@fortawesome/free-solid-svg-icons";
import useLocalStorageState from "use-local-storage-state";

type SelectedWeek = {
  weekName: string;
};

type CompletedProps = {
  selectedWeek: SelectedWeek | null;
  uploadStatus: string;
  uploadElapsedTime: number;
};

const Phase04_Completed = ({
  selectedWeek,
  uploadStatus,
  uploadElapsedTime
}: CompletedProps) => {
  const [withParticipantsData, setWithParticipantsData] = useLocalStorageState(
    "withParticipantsData"
  );

  const handleConfirmDone = () => {
    setWithParticipantsData(true);
  };

  function formatShortTime(seconds: number): string {
    const units = [
      { label: "d", value: Math.floor(seconds / 86400) },
      { label: "h", value: Math.floor((seconds % 86400) / 3600) },
      { label: "m", value: Math.floor((seconds % 3600) / 60) },
      { label: "s", value: seconds % 60 }
    ];

    const result = units.filter((u) => u.value > 0).slice(0, 2);
    return result.length > 0
      ? result.map((u) => `${u.value}${u.label}`).join(" ")
      : "0s";
  }

  return (
    <div className={`upload-phase ${uploadStatus !== "completed" && "hidden"}`}>
      <UploadBox className="bg-yellow-800 relative overflow-hidden">
        <UploadBox.Header>Processing Complete!</UploadBox.Header>
        <UploadBox.Body className="flex flex-col justify-around z-10">
          <div className="flex justify-center items-center">
            <div className="file-details flex flex-col justify-between items-start">
              <div className="file-subdetails text-sm flex flex-col items-center">
                <span>Total Entries</span>
                <span className="font-bold">200,000</span>
              </div>
            </div>
          </div>
          <div className="time-remaining">
            <div className="bg-[#000000d8] text-white flex flex-col justify-center items-center rounded-full p-3 px-6">
              Selected Week: <br />
              <span className="font-bol">
                {selectedWeek ? selectedWeek.weekName : "Loading"}
              </span>
            </div>
          </div>
        </UploadBox.Body>
        <UploadBox.Footer className=" z-10">
          <div className="elapsed-time">
            Upload Process Time: {formatShortTime(uploadElapsedTime)}
          </div>
          <UploadButton
            className="bg-[#0000008c]! hover:bg-[#00000052]! "
            onClick={handleConfirmDone}
          >
            Confirm Done
          </UploadButton>
        </UploadBox.Footer>
      </UploadBox>
    </div>
  );
};

export default Phase04_Completed;
