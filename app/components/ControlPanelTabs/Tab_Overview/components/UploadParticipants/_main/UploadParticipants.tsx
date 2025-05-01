import React, { useState, useRef } from "react";
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
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [attachedFile, setAttachedFile] = useState<File | null>(null);

  type UploadStatus =
    | "idle"
    | "attached"
    | "processing"
    | "error"
    | "completed";

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

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleUploadComplete = () => {
    uploadComplete(true);
  };

  const handleFileUpload = async () => {};

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setAttachedFile(file || null);
    setIsProcessing(true);
  };

  const resetFileAttachement = () => {};

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
          <UploadBox uploadState={uploadStatus} formState={formStatus}>
            <UploadBox.Header>
              {UploadBoxPhases["idle"].Header()}
            </UploadBox.Header>
            <UploadBox.Body>{UploadBoxPhases["idle"].Body()}</UploadBox.Body>
            <UploadBoxFooter>
              {UploadBoxPhases["idle"].Footer()}
            </UploadBoxFooter>
          </UploadBox>
          <div
            className={`upload-data-shell w-full bg-gray-950 p-4 border-dashed border-gray-500 rounded-lg border-2 text-center transition-all duration-200 aspect-[5/4] flex flex-col justify-center items-center relative ${
              isDragging
                ? "bg-pink-700 border-gray-300 animate-pulse"
                : fileName
                ? "bg-green-500 text-black"
                : "hover:bg-gray-800 text-gray-300"
            }`}
          >
            <div className="upper-part grow flex justify-center items-center flex-col gap-2 w-full z-10">
              <div className="text-sm w-full h-full">
                {isDragging ? (
                  "Drop the file here"
                ) : fileName ? (
                  <div className="bg-[#00000083] w-full h-full flex flex-col items-center justify-center rounded-xl text-gray-200 relative">
                    File selected: {fileName}
                    {!isProcessing ? (
                      <button
                        type="button"
                        className="ms-2 absolute top-0 right-0 bg-[#424242b6] h-[30px] aspect-square rounded-full flex items-center justify-center hover:bg-[#222222b6] transition-all duration-200 cursor-pointer m-2"
                        aria-label="Remove File"
                        onClick={resetFileAttachement}
                      >
                        <FontAwesomeIcon
                          icon={faClose}
                          className="text-gray-300"
                        />
                      </button>
                    ) : (
                      <>
                        <div className="processing-indicator">
                          <p>Total Entries: 200k</p>
                          Processing Data: 50%
                          <p>Estimated time remaining: 30 seconds</p>
                        </div>
                      </>
                    )}
                  </div>
                ) : (
                  "Drag and drop a CSV file here or click to upload"
                )}
              </div>
              {!isDragging && !fileName && (
                <p className="text-gray-300 mt-2 text-xs">
                  Upload a CSV file with the participants data. The file should
                  contain the following columns: Full Name, Alpha Numeric Code,
                  Region/Location.
                </p>
              )}
            </div>

            <div className="lower-part w-full z-10">
              {!isDragging ? (
                fileName ? (
                  !isProcessing ? (
                    <button
                      className="bg-red-600 hover:bg-red-500 px-4 h-[40px] w-full text-center rounded-xl cursor-pointer mt-2 flex items-center justify-center gap-2 text-white animate-pulse"
                      onClick={handleFileUpload}
                    >
                      Upload CSV
                    </button>
                  ) : (
                    <button
                      className="bg-gray-600 px-4 h-[40px] w-full text-center rounded-xl cursor-not-allowed mt-2 flex items-center justify-center gap-2 text-white"
                      disabled
                    >
                      {status}
                    </button>
                  )
                ) : (
                  <button
                    className="bg-gray-600 hover:bg-gray-500 px-4 h-[40px] w-full text-center rounded-xl cursor-pointer mt-2 flex items-center justify-center gap-2"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    Select and Attach File
                  </button>
                )
              ) : null}
            </div>

            <div
              className="progress-filler bg-green-300 absolute top-0 left-0 h-full transition-all ease-linear -z-0 animate-pulse"
              style={{ width: `30%` }}
              aria-label="Progress Filler"
            ></div>

            <input
              ref={fileInputRef}
              type="file"
              id="fileInput"
              accept=".csv"
              className="hidden"
              onChange={handleFileChange}
              aria-label="File Upload"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default UploadParticipants;
