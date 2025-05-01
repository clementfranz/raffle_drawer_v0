import React, { useState, useRef, useEffect } from "react";
import Papa from "papaparse";
import type { IDBPDatabase } from "idb";
import { openDB } from "idb";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose, faFileCsv } from "@fortawesome/free-solid-svg-icons";

// Components
import UploadBox from "../components/UploadBox/_main/UploadBox";

import useLocalStorageState from "use-local-storage-state";
import UploadBoxFooter from "../components/UploadBox/components/UploadBoxFooter/_main/UploadBoxFooter";
import UploadButton from "../components/UploadButton/_main/UploadButton";

// UploadBox Phases
import { UploadBoxPhases } from "../data/UploadBoxPhases";

interface UploadParticipantsProps {
  uploadComplete: React.Dispatch<React.SetStateAction<boolean>>;
}

const UploadParticipants: React.FC<UploadParticipantsProps> = ({
  uploadComplete
}) => {
  // FILE STATES
  const [fileName, setFileName] = useState("");
  const [attachedFile, setAttachedFile] = useState<File | null>(null);

  type UploadStatus = keyof typeof UploadBoxPhases;

  type FormStatus = "default" | "droppable" | "catcher";

  const [uploadStatus, setUploadStatus] = useState<UploadStatus>("idle");
  const [formStatus, setFormStatus] = useState<FormStatus>("default");

  const [isProcessing, setIsProcessing] = useState(false);

  const [status, setStatus] = useState("Upload");

  interface SelectedWeek {
    weekName: string;
    weekCode: string;
  }

  const [selectedWeek, setSelectedWeek] =
    useLocalStorageState<SelectedWeek | null>("selectedWeek");

  const handleUploadComplete = () => {
    uploadComplete(true);
  };

  const handleFileUpload = async () => {};

  const handleAttachedFile = () => {
    setIsProcessing(true);
    if (attachedFile) {
      console.log(attachedFile.name);
    }
  };

  const resetFileAttachement = () => {};

  const fileStates = {
    fileName,
    setFileName,
    attachedFile,
    setAttachedFile
  };

  useEffect(() => {
    if (attachedFile) {
      handleAttachedFile();
    }
  }, [attachedFile]);

  return (
    <>
      <div className="flex flex-col gap-2 text-sm w-full">
        <div className="upload-data w-full">
          <div className="bg-gray-950 text-white h-[40px] flex justify-center items-center rounded-full">
            Selected Week: {selectedWeek ? selectedWeek.weekName : "Loading"}
          </div>
          <p className="text-gray-300 text-sm my-2 text-center italic">
            No participants data found.
          </p>
          <UploadBox
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
          </UploadBox>
        </div>
      </div>
    </>
  );
};

export default UploadParticipants;
