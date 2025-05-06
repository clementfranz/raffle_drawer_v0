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
};

const Phase04_Completed = ({ selectedWeek, uploadStatus }: CompletedProps) => {
  const [withParticipantsData, setWithParticipantsData] = useLocalStorageState(
    "withParticipantsData",
    {
      defaultValue: false
    }
  );

  const handleConfirmDone = () => {
    setWithParticipantsData(true);
  };

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
