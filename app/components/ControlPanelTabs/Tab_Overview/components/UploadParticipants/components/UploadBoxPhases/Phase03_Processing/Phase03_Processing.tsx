import React, { useEffect, useState } from "react";

// Components
import UploadBox from "../../UploadBox/_main/UploadBox";
import UploadButton from "../../UploadButton/_main/UploadButton";

// Custom Icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileCsv } from "@fortawesome/free-solid-svg-icons";

import { formatFileSize, importCsvToIndexedDB } from "./utils/necessaryOnly";

type FileDetails = any;

type ProcessingProps = {
  fileAttached: File | null;
  fileDetails: FileDetails | null;
  triggerImport: boolean;
};

const Phase03_Processing = ({
  fileAttached,
  fileDetails,
  triggerImport
}: ProcessingProps) => {
  const [entriesProcessed, setEntriesProcessed] = useState(0);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleImport = async (file: File) => {
    try {
      await importCsvToIndexedDB(
        file,
        "raffle2025",
        1000, // batch size
        setEntriesProcessed,
        setUploadProgress
      );
      console.log("Import completed ✅");
    } catch (err) {
      console.error("Import failed", err);
    }
  };

  useEffect(() => {
    if (triggerImport && fileAttached) {
      handleImport(fileAttached);
    }
  }, [triggerImport]);

  return (
    <div className="upload-phase ">
      <UploadBox className="bg-green-800 relative overflow-hidden">
        <UploadBox.Header className="text-left z-10">
          Uploading File...
        </UploadBox.Header>
        <UploadBox.Body className="flex flex-col justify-between z-10">
          <div className="flex justify-center items-center gap-5">
            <div className="file-icon ">
              <FontAwesomeIcon
                icon={faFileCsv}
                className="text-white text-[80px]"
              />
            </div>
            <div className="file-details flex flex-col justify-between items-start h-[80px]">
              <div className="file-name text-lg font-bold">
                {fileAttached ? (
                  fileAttached.name
                ) : (
                  <span className="italic">Unknown File</span>
                )}
              </div>
              <div className="file-subdetails text-sm flex flex-col items-start">
                <span>
                  Size:{" "}
                  <b>
                    {fileAttached ? (
                      formatFileSize(fileAttached.size)
                    ) : (
                      <span className="italic">--</span>
                    )}
                  </b>
                </span>
                <span>
                  Entries:{" "}
                  {fileDetails ? (
                    // countCsvRows(fileAttached)
                    <>{fileDetails.entries.toLocaleString()}</>
                  ) : (
                    <span className="italic">--</span>
                  )}
                </span>
              </div>
            </div>
          </div>
          <div className="time-remaining">
            Estimated Time Remaining: 59 seconds
          </div>
        </UploadBox.Body>
        <UploadBox.Footer className=" z-10">
          <UploadButton clickable={false} className="bg-[#0000008c]! ">
            Processing File - {uploadProgress}%
          </UploadButton>
        </UploadBox.Footer>
        <div
          className={`progress-bar absolute top-0 left-0 h-full bg-green-600 -z-0  transition-all ease-linear  animate-pulse `}
          style={{ width: `${uploadProgress}%` }}
        ></div>
      </UploadBox>
    </div>
  );
};

export default Phase03_Processing;
