import React, { useEffect, useRef, useState } from "react";

// Components
import UploadBox from "../../UploadBox/_main/UploadBox";
import UploadButton from "../../UploadButton/_main/UploadButton";

// Custom Icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCloudArrowDown, faFileCsv } from "@fortawesome/free-solid-svg-icons";

import { formatFileSize } from "./utils/necessaryOnly";
import useLocalStorageState from "use-local-storage-state";
import { parseCSV } from "~/hooks/csvParser/parseCSV";
import { addParticipantByBatch } from "~/hooks/indexedDB/participant/addParticipantByBatch";
import { countEntriesByLocationWithProgress } from "~/hooks/indexedDB/_main/useIndexedDB";
import { syncParticipantsToCloud } from "~/hooks/indexedDB/syncCloud/syncParticipantsToCloud";

type FileDetails = any;

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";

  const units = ["B", "KB", "MB", "GB", "TB"];
  const k = 1024;
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const size = bytes / Math.pow(k, i);

  return `${size % 1 === 0 ? size : size.toFixed(2)} ${units[i]}`;
}

type ProcessingProps = {
  fileAttached: File | null;
  fileDetails: FileDetails | null;
  triggerImport: boolean;
  setUploadStatus: React.Dispatch<
    React.SetStateAction<"idle" | "attached" | "processing" | "completed">
  >;
  uploadStatus: string;
  cloudData: any[] | null;
  setUploadElapsedTime: React.Dispatch<React.SetStateAction<number>>;
};

const Phase03_Processing = ({
  fileAttached,
  fileDetails,
  triggerImport,
  setUploadStatus,
  uploadStatus,
  cloudData,
  setUploadElapsedTime
}: ProcessingProps) => {
  const [entriesProcessed, setEntriesProcessed] = useState(0);
  const [loadingStats, setLoadingStats] = useState(false);
  const [countingProgress, setCountingProgress] = useState(0);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [preUploadLoading, setPreUploadLoading] = useState(false);

  const [timeElapsed, setTimeElapsed] = useState(0); // in seconds
  const [timeRemaining, setTimeRemaining] = useState(0); // in seconds

  const startTimeRef = useRef<number | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const [withCloudData] = useLocalStorageState<boolean>("withCloudData");

  const [regionalStats, setRegionalStats] = useLocalStorageState<{
    regions: { location: string; count: number }[];
  } | null>("regionalStats", {
    defaultValue: null
  });

  // Start the timer when upload begins
  useEffect(() => {
    if (uploadProgress > 0 && startTimeRef.current === null) {
      startTimeRef.current = Date.now();

      timerRef.current = setInterval(() => {
        if (startTimeRef.current) {
          const elapsedSec = Math.floor(
            (Date.now() - startTimeRef.current) / 1000
          );
          setTimeElapsed(elapsedSec);
        }
      }, 1000);
    }

    // Stop the timer when upload completes
    if (uploadProgress >= 100 && timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, [uploadProgress]);

  // Estimate time remaining whenever progress or timeElapsed changes
  useEffect(() => {
    if (uploadProgress > 0 && uploadProgress < 100 && timeElapsed > 0) {
      const estimatedTotalTime = (timeElapsed / uploadProgress) * 100;
      const remainingTime = estimatedTotalTime - timeElapsed;
      setTimeRemaining(Math.ceil(remainingTime));
    }

    if (uploadProgress === 100) {
      setTimeRemaining(0); // done
    }

    if (uploadProgress >= 100) {
      setUploadElapsedTime(timeElapsed);
    }
  }, [uploadProgress, timeElapsed]);

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

  const handleImport = async (file?: File) => {
    try {
      // Await the promise returned by parseCSV to get the CSV data
      let CSVData;

      if (file) {
        CSVData = await parseCSV(file);
      } else {
        CSVData = cloudData;
      }

      // Log the parsed data
      console.log("Parsed CSV Data: ", CSVData);

      // Proceed only if the CSV data is successfully parsed
      if (CSVData) {
        console.log("Attempting to upload...");

        // Call addParticipantByBatch and update progress
        const uploadDone = await addParticipantByBatch(
          CSVData,
          "WEEK-2025-06",
          (newProgress) => {
            setUploadProgress(newProgress);
          }
        );

        if (uploadDone) {
          const getRegionalStats = await handleGetRegionalStats();

          if (!withCloudData && getRegionalStats) {
            console.log("Attempting to queue sync of data");
            const queuedSyncData = await syncParticipantsToCloud(
              uploadDone,
              "batch-2025-05-13-A",
              "/participants/per-batch",
              (progress) => {
                console.log("Sync Progress:", progress, "%");
              }
            );
            if (queuedSyncData) {
              console.log("All Data queued for syncing...");
            }
          }
        }

        console.log("Import completed ✅");
      }
    } catch (err) {
      console.error("Import failed", err);
    }
  };

  const handleGetRegionalStats = async (): Promise<boolean> => {
    console.log("Getting regional stats.");
    const regionalStatistics = await countEntriesByLocationWithProgress(
      setCountingProgress
    );
    if (regionalStatistics) {
      setRegionalStats(regionalStatistics);
      console.log("Done getting regional stats.");
      return true;
    } else {
      return false;
    }
  };

  useEffect(() => {
    // if (uploadProgress >= 100 && countingProgress < 100) {
    //   handleGetRegionalStats();
    // }

    if (uploadProgress >= 100 && countingProgress >= 100) {
      setUploadStatus("completed");
    }
    console.log("UPLOAD PROGRESS: ", uploadProgress);
    console.log("COUNTING PROGRESS: ", countingProgress);
  }, [uploadProgress, countingProgress]);

  useEffect(() => {
    if (fileDetails && fileDetails?.entries > 0) {
      const progress = Math.round(
        (entriesProcessed / fileDetails.entries) * 100
      );
      // setUploadProgress(progress);
      console.log("LIVE UPLOAD PROGRESS: ", progress);
    }
  }, [entriesProcessed]);

  useEffect(() => {
    if (triggerImport && fileAttached && fileDetails) {
      if (fileDetails.entries > 0) {
        handleImport(fileAttached);
        console.log("FILE ENTRIES COUNT", fileDetails.entries);
      }
    } else if (triggerImport && cloudData) {
      handleImport();
    }
  }, [triggerImport, fileDetails, cloudData]);

  return (
    <div
      className={`upload-phase ${uploadStatus !== "processing" && "hidden"}`}
    >
      <UploadBox className="bg-green-800 relative overflow-hidden">
        <UploadBox.Header className="text-left z-10">
          {cloudData ? "Processing Downloaded Data..." : "Uploading File..."}
        </UploadBox.Header>
        <UploadBox.Body className="flex flex-col justify-between z-10 w-full">
          <div className="flex justify-center items-center gap-5 w-full">
            <div className="file-icon w-[80px] mr-4">
              {cloudData ? (
                <FontAwesomeIcon
                  icon={faCloudArrowDown}
                  className="text-white text-[80px] "
                />
              ) : (
                <FontAwesomeIcon
                  icon={faFileCsv}
                  className="text-white text-[80px]"
                />
              )}
            </div>
            <div className="file-details flex flex-col justify-between items-start h-[80px] grow w-0">
              <div className="file-name text-lg font-bold mb-2">
                {fileAttached ? (
                  <span className="break-all line-clamp-2 w-full">
                    {fileAttached.name}
                  </span>
                ) : cloudData ? (
                  <>Data from Cloud</>
                ) : (
                  <span className="italic">Unknown File</span>
                )}
              </div>
              <div className="file-subdetails text-sm flex flex-col items-start">
                <span>
                  Size:{" "}
                  <b>
                    {fileAttached && fileDetails ? (
                      formatFileSize(fileAttached.size)
                    ) : cloudData ? (
                      <>{formatBytes(fileDetails?.entries * 70)}</>
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
          {/* <div className="time-remaining">
            Estimated Time Remaining: 59 seconds
          </div> */}
        </UploadBox.Body>
        <UploadBox.Footer className=" z-10">
          <div className="clock flex text-sm justify-between">
            <div className="time-detail bg-[#00000056] p-1 px-2.5 rounded-2xl">
              ⏱️ ELT: {formatShortTime(timeElapsed)}{" "}
            </div>
            <div className="time-detail bg-[#00000056] p-1 px-2.5 rounded-2xl">
              ⌛ ETR: {formatShortTime(timeRemaining)}{" "}
            </div>
          </div>
          <UploadButton clickable={false} className="bg-[#0000008c]! ">
            {preUploadLoading ? (
              <span className="pulse text-red-600 font-bold">
                Please wait...
              </span>
            ) : (
              <>
                {uploadProgress < 100 ? (
                  <>Processing File - {uploadProgress.toFixed(2)}%</>
                ) : (
                  <>Getting Regional Stats - {countingProgress.toFixed(2)}%</>
                )}
              </>
            )}
          </UploadButton>
        </UploadBox.Footer>
        <div
          className={`progress-bar absolute top-0 left-0 h-full bg-green-600 -z-0  transition-all ease-linear  animate-pulse `}
          style={{ width: `${uploadProgress}%` }}
        ></div>
        <div
          className={`progress-bar absolute top-0 left-0 h-full bg-amber-600 -z-0  transition-all ease-linear  animate-pulse opacity-40 `}
          style={{ width: `${countingProgress}%` }}
        ></div>
      </UploadBox>
    </div>
  );
};

export default Phase03_Processing;
