import React, { useEffect, useState } from "react";

// Components
import UploadBox from "../../UploadBox/_main/UploadBox";
import UploadButton from "../../UploadButton/_main/UploadButton";

// Custom Icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileCsv } from "@fortawesome/free-solid-svg-icons";

import { formatFileSize, importCsvToIndexedDB } from "./utils/necessaryOnly";
import useLocalStorageState from "use-local-storage-state";

const indexDBName = "ParticipantsDB";
const storeName = "participantsData_raffle2025";

type FileDetails = any;

type ProcessingProps = {
  fileAttached: File | null;
  fileDetails: FileDetails | null;
  triggerImport: boolean;
  setUploadStatus: React.Dispatch<
    React.SetStateAction<"idle" | "attached" | "processing" | "completed">
  >;
  uploadStatus: string;
};

const countLocationsFromIndexedDB = async (
  setLoadingStats: (loading: boolean) => void,
  setCountingProgress: (percentage: number) => void,
  indexDBName: string,
  storeName: string
): Promise<{ location: string; count: number }[]> => {
  return new Promise((resolve, reject) => {
    console.log("Starting Counting Regions: ...");

    setLoadingStats(true);
    setCountingProgress(0);

    const request = indexedDB.open(indexDBName);

    request.onerror = () => reject("Failed to open IndexedDB");

    request.onsuccess = () => {
      const db = request.result;
      const transaction = db.transaction(storeName, "readonly");
      const store = transaction.objectStore(storeName);

      const locationsCount: Record<string, number> = {};

      // Step 1: Count total entries first
      let totalEntries = 0;
      const countRequest = store.count();

      countRequest.onsuccess = () => {
        totalEntries = countRequest.result;
        if (totalEntries === 0) {
          setLoadingStats(false);
          setCountingProgress(100);
          resolve([]);
          return;
        }

        // Step 2: Start cursoring and track progress
        let processedEntries = 0;
        const cursorRequest = store.openCursor();

        cursorRequest.onsuccess = (event) => {
          const cursor = (event.target as IDBRequest<IDBCursorWithValue>)
            .result;
          if (cursor) {
            const data = cursor.value;
            const location = data.regional_location || "Unknown";

            locationsCount[location] = (locationsCount[location] || 0) + 1;

            processedEntries++;
            const progress = Math.min(
              Math.round((processedEntries / totalEntries) * 100),
              100
            );
            setCountingProgress(progress);

            cursor.continue();
          } else {
            // Done
            const result = Object.entries(locationsCount).map(
              ([location, count]) => ({
                location,
                count
              })
            );
            setLoadingStats(false);
            setCountingProgress(100);

            console.log("✅ Done Counting Regions: ...");
            resolve(result);
          }
        };

        cursorRequest.onerror = () => reject("Cursor failed");
      };

      countRequest.onerror = () => reject("Count request failed");
    };
  });
};

const Phase03_Processing = ({
  fileAttached,
  fileDetails,
  triggerImport,
  setUploadStatus,
  uploadStatus
}: ProcessingProps) => {
  const [entriesProcessed, setEntriesProcessed] = useState(0);
  const [loadingStats, setLoadingStats] = useState(false);
  const [countingProgress, setCountingProgress] = useState(0);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [preUploadLoading, setPreUploadLoading] = useState(false);

  const [regionalStats, setRegionalStats] = useLocalStorageState<
    { location: string; count: number }[]
  >("reginalStats", {
    defaultValue: []
  });

  const getRegionalStats = () => {
    countLocationsFromIndexedDB(
      setLoadingStats,
      setCountingProgress,
      indexDBName,
      storeName
    ).then((registeredLocations) => {
      setRegionalStats(registeredLocations);
    });
  };

  const handleImport = async (file: File) => {
    try {
      await importCsvToIndexedDB(
        file,
        "raffle2025",
        1000, // batch size
        setEntriesProcessed,
        setUploadProgress,
        setPreUploadLoading
      );
      await getRegionalStats();
      console.log("Import completed ✅");
    } catch (err) {
      console.error("Import failed", err);
    }
  };

  useEffect(() => {
    if (uploadProgress === 100) {
      setUploadStatus("completed");
    }
  }, [uploadProgress]);

  useEffect(() => {
    if (triggerImport && fileAttached) {
      handleImport(fileAttached);
    }
  }, [triggerImport]);

  return (
    <div
      className={`upload-phase ${uploadStatus !== "processing" && "hidden"}`}
    >
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
          {/* <div className="time-remaining">
            Estimated Time Remaining: 59 seconds
          </div> */}
        </UploadBox.Body>
        <UploadBox.Footer className=" z-10">
          <UploadButton clickable={false} className="bg-[#0000008c]! ">
            {preUploadLoading ? (
              <span className="pulse text-red-600 font-bold">
                Please wait...
              </span>
            ) : (
              <>Processing File - {uploadProgress + countingProgress}%</>
            )}
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
