import React, { useState, useEffect } from "react";

// Components

import useLocalStorageState from "use-local-storage-state";

import Phase01_Idle from "../components/UploadBoxPhases/Phase01_Idle/Phase01_Idle";
import Phase02_Attached from "../components/UploadBoxPhases/Phase02_Attached/Phase02_Attached";
import Phase03_Processing from "../components/UploadBoxPhases/Phase03_Processing/Phase03_Processing";
import Phase04_Completed from "../components/UploadBoxPhases/Phase04_Completed/Phase04_Completed";

interface UploadParticipantsProps {
  uploadComplete: React.Dispatch<React.SetStateAction<boolean>>;
}

const UploadParticipants: React.FC<UploadParticipantsProps> = ({
  uploadComplete
}) => {
  // FILE STATES
  const [fileAttached, setFileAttached] = useState<File | null>(null);
  const [fileDetails, setFileDetails] = useLocalStorageState<Object | null>(
    "fileDetails",
    { defaultValue: null }
  );

  const [cloudData, setCloudData] = useState<any[] | null>(null);

  const [triggerImport, setTriggerImport] = useState<boolean>(false);
  const [uploadElapsedTime, setUploadElapsedTime] = useState<number>(0);
  const [downloadElapsedTime, setDownloadElapsedTime] = useState<number>(0);

  // UPLOAD STATES
  type UploadStatusTypes = "idle" | "attached" | "processing" | "completed";
  const [uploadStatus, setUploadStatus] = useState<UploadStatusTypes>("idle");

  const [withCloudData] = useLocalStorageState<boolean>("withCloudData");

  interface SelectedWeek {
    weekName: string;
    weekCode: string;
  }

  const [selectedWeek, setSelectedWeek] =
    useLocalStorageState<SelectedWeek | null>("selectedWeek", {
      defaultValue: null
    });

  const handleAttachedFile = () => {
    // setIsProcessing(true);
    if (fileAttached) {
      console.log(fileAttached.name);
    }
  };

  useEffect(() => {
    if (fileAttached) {
      handleAttachedFile();
    }
  }, [fileAttached]);

  return (
    <>
      <div className="flex flex-col gap-2 text-sm w-full">
        <div className="upload-data w-full">
          <div className="bg-gray-950 text-white h-[40px] flex justify-center items-center rounded-full  mb-2">
            Selected Week: {selectedWeek ? selectedWeek.weekName : "Loading"}
          </div>
          {!withCloudData && (
            <p className="text-gray-300 text-sm mb-2 text-center italic">
              No participants data found.
            </p>
          )}

          {/* PHASE 01 */}
          <Phase01_Idle
            setFileAttached={setFileAttached}
            setFileDetails={setFileDetails}
            setUploadStatus={setUploadStatus}
            uploadStatus={uploadStatus}
            setCloudData={setCloudData}
            setTriggerImport={setTriggerImport}
            setDownloadElapsedTime={setDownloadElapsedTime}
          />

          {/* PHASE 02 */}
          <Phase02_Attached
            fileAttached={fileAttached}
            fileDetails={fileDetails}
            setTriggerImport={setTriggerImport}
            setUploadStatus={setUploadStatus}
            uploadStatus={uploadStatus}
            setFileAttached={setFileAttached}
            setFileDetails={setFileDetails}
            cloudData={cloudData}
          />

          {/* PHASE 03 */}
          <Phase03_Processing
            fileAttached={fileAttached}
            fileDetails={fileDetails}
            triggerImport={triggerImport}
            setUploadStatus={setUploadStatus}
            uploadStatus={uploadStatus}
            cloudData={cloudData}
            setUploadElapsedTime={setUploadElapsedTime}
          />

          {/* PHASE 04 */}
          <Phase04_Completed
            selectedWeek={selectedWeek}
            uploadStatus={uploadStatus}
            uploadElapsedTime={uploadElapsedTime}
            cloudData={cloudData}
            downloadElapsedTime={downloadElapsedTime}
          />

          {/* <UploadBox
            uploadState={uploadStatus}
            setUploadState={setUploadStatus}
            fileStates={fileStates}
          >
            <UploadBox.Header>
              {UploadBoxPhases["idle"].Header()}
            </UploadBox.Header>
            <UploadBox.Body>
              {UploadBoxPhases[uploadStatus].Body()}
            </UploadBox.Body>
            <UploadBoxFooter>
              {UploadBoxPhases[uploadStatus].Footer({
                setAttachedFile,
                setUploadStatus
              })}
            </UploadBoxFooter>
          </UploadBox> */}
        </div>
      </div>
    </>
  );
};

export default UploadParticipants;
