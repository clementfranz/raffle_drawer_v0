import React, { type SetStateAction } from "react";

// Components
import UploadBox from "../../UploadBox/_main/UploadBox";
import UploadButton from "../../UploadButton/_main/UploadButton";

// Custom Icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileCsv } from "@fortawesome/free-solid-svg-icons";

type FileDetails = any;

type AttachedProps = {
  fileAttached: File | null;
  fileDetails: FileDetails | null;
  setTriggerImport: React.Dispatch<SetStateAction<boolean>>;
  setUploadStatus: React.Dispatch<
    React.SetStateAction<"idle" | "attached" | "processing" | "completed">
  >;
  uploadStatus: string;
  setFileAttached: React.Dispatch<SetStateAction<File | null>>;
  setFileDetails: React.Dispatch<SetStateAction<Object | null>>;
};

const formatFileSize = (bytes: number): string => {
  const units = ["B", "KB", "MB", "GB", "TB"];
  let size = bytes;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }

  return `${size.toFixed(2)} ${units[unitIndex]}`;
};

const Phase02_Attached = ({
  fileAttached,
  fileDetails,
  setTriggerImport,
  setUploadStatus,
  uploadStatus,
  setFileAttached,
  setFileDetails
}: AttachedProps) => {
  const handleSubmit = () => {
    if (fileAttached) {
      setTriggerImport(true);
      setUploadStatus("processing");
    }
  };

  const handleCancel = () => {
    setFileAttached(null);
    setFileDetails(null);
    setUploadStatus("idle");
  };

  return (
    <div className={`upload-phase ${uploadStatus !== "attached" && "hidden"}`}>
      <UploadBox className="bg-emerald-800">
        <UploadBox.Header className="text-left">
          File Attached:
        </UploadBox.Header>
        <UploadBox.Body className="flex justify-center items-start gap-5">
          <div className="file-icon ">
            <FontAwesomeIcon
              icon={faFileCsv}
              className="text-white text-[80px]"
            />
          </div>
          <div className="file-details flex flex-col justify-between items-start h-[80px]">
            <div className="file-name text-lg font-bold w-[200px] overflow-hidden ">
              {fileAttached ? (
                <span className="line-clamp-2 block">{fileAttached.name}</span>
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
        </UploadBox.Body>
        <UploadBox.Footer>
          <div className="two-btns flex gap-2">
            <UploadButton
              className="bg-red-700 hover:bg-red-600"
              onClick={handleCancel}
            >
              Cancel
            </UploadButton>
            {/* <UploadButton className="cursor-not-allowed!">
              Re-upload
            </UploadButton> */}
          </div>
          <UploadButton
            className="bg-[#0000008c]! hover:bg-[#00000052]!"
            onClick={handleSubmit}
          >
            Submit & Process File
          </UploadButton>
        </UploadBox.Footer>
      </UploadBox>
    </div>
  );
};

export default Phase02_Attached;
