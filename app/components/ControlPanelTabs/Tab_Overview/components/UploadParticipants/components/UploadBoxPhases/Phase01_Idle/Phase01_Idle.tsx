import React, { useEffect, useRef, useState } from "react";

// Other Packages
import Papa from "papaparse";

// Components
import UploadBox from "../../UploadBox/_main/UploadBox";
import UploadButton from "../../UploadButton/_main/UploadButton";
import { getParticipantsTotalCount } from "~/api/client/participants/getParticipantsTotalCount";
import { getPaginatedParticipants } from "~/api/client/participants/getPaginatedParticipants";
import useLocalStorageState from "use-local-storage-state";

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

type IdleProps = {
  setFileAttached: React.Dispatch<React.SetStateAction<File | null>>;
  setFileDetails: React.Dispatch<React.SetStateAction<Object | null>>;
  setUploadStatus: React.Dispatch<
    React.SetStateAction<"idle" | "attached" | "processing" | "completed">
  >;
  uploadStatus: string;
  setCloudData: React.Dispatch<React.SetStateAction<any[] | null>>;
};

const Phase01_Idle = ({
  setFileAttached,
  setFileDetails,
  setUploadStatus,
  uploadStatus,
  setCloudData
}: IdleProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleButtonClick = () => {
    inputRef.current?.click(); // Trigger the hidden file input click
  };

  const [isServerActive] = useLocalStorageState<boolean>("isServerActive");
  const [isFileValid, setIsFileValid] = useState(true);

  // DRAG STATES
  const [isDragging, setIsDragging] = useState(false);
  const [downloadedData, setDownloadedData] = useState<any[]>([]);
  const [withCloudData, setWithCloudData] = useLocalStorageState<boolean>(
    "withCloudData",
    { defaultValue: false }
  );
  const [isDownloadingData, setIsDownloadingData] = useState(false);

  const [downloadProgress, setDownloadProgress] = useState(0);

  useEffect(() => {
    if (downloadedData) {
      setCloudData(downloadedData);
    }
  }, [downloadedData]);

  // FORM STATES
  type FormStateType = "default" | "undroppable" | "catcher";
  const [formState, setFormState] = useState<FormStateType>("default");

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);
    setFormState("catcher");
  };

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    setIsDragging(false);
    setFormState("default");
  };

  const [fileValidityResetCounter, setFileValidityResetCounter] = useState(5);

  const handleFileProcess = async (file: File) => {
    if (file.type === "text/csv") {
      setFileAttached(file);
      const rows = await countCsvRows(file);
      if (rows && isFileValid) {
        setUploadStatus("attached");
        setFileDetails({ entries: rows });
      } else {
        setFileAttached(null);

        let countdown = 4;

        const resetFileValidityCounter = setInterval(() => {
          setFileValidityResetCounter(countdown);
          countdown--;

          if (countdown < 0) {
            clearInterval(resetFileValidityCounter);
            setIsFileValid(true);
            setFileValidityResetCounter(5);
          }
        }, 1000);
      }
    } else {
      alert("Please upload a valid CSV file.");
    }
  };

  const handleDataDownloaded = () => {};

  const handleDrop = async (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    setFormState("default");

    const files = event.dataTransfer.files;
    if (files.length > 0) {
      await handleFileProcess(files[0]);
    }
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      await handleFileProcess(files[0]);
    }
  };

  const [ETR, setETR] = useState<number>(60);

  const batchDurationsRef = useRef<number[]>([]);
  const prevDownloadedRef = useRef<number>(0);
  const prevTimestampRef = useRef<number>(Date.now());
  const MAX_SAMPLES = 10; // Keep recent 10 batches for moving average
  const isActiveRef = useRef(false); // Control countdown activity

  const updateDownloadProgress = (downloaded: number, total: number) => {
    const progress = (downloaded / total) * 100;
    setDownloadProgress(progress);

    const now = Date.now();
    const prevDownloaded = prevDownloadedRef.current;
    const prevTimestamp = prevTimestampRef.current;

    const deltaItems = downloaded - prevDownloaded;
    const deltaTime = now - prevTimestamp;

    // Only push if there's progress
    if (deltaItems > 0) {
      const perItemTime = deltaTime / deltaItems;

      batchDurationsRef.current.push(perItemTime);

      // Limit to last N samples
      if (batchDurationsRef.current.length > MAX_SAMPLES) {
        batchDurationsRef.current.shift();
      }

      prevDownloadedRef.current = downloaded;
      prevTimestampRef.current = now;
    }

    // Average time per item (ms)
    const avgPerItemTime =
      batchDurationsRef.current.reduce((sum, val) => sum + val, 0) /
      batchDurationsRef.current.length;

    const remainingItems = total - downloaded;
    const estimatedRemainingMs = avgPerItemTime * remainingItems;
    const remainingSec = Math.ceil(Math.max(0, estimatedRemainingMs / 1000));

    setETR(remainingSec);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (isActiveRef.current) {
        setETR((prev) => Math.max(0, prev - 1));
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleFileUpload = () => {
    fileInputRef.current?.click();
  };

  const handleStartDownloadData = () => {
    handleDownloadData(updateDownloadProgress);
  };

  const handleDownloadData = async (updateDownloadProgress: any) => {
    if (isDownloadingData) return;
    setIsDownloadingData(true);
    isActiveRef.current = true; // Start countdown

    try {
      const { total } = await getParticipantsTotalCount();
      let allData: any[] = [];

      if (total && total > 0) {
        const batchSize = 2500;
        const totalBatches = Math.ceil(total / batchSize);
        const concurrencyLimit = 20;

        const fetchBatch = async (indexBatch: number) => {
          const response = await getPaginatedParticipants(
            indexBatch,
            batchSize
          );
          return response.data || [];
        };

        let downloadedCount = 0;

        for (let i = 1; i <= totalBatches; i += concurrencyLimit) {
          const batchPromises = [];

          for (let j = i; j < i + concurrencyLimit && j <= totalBatches; j++) {
            batchPromises.push(fetchBatch(j));
          }

          const batchResults = await Promise.all(batchPromises);

          let entriesThisRound = 0;
          for (const participants of batchResults) {
            allData.push(...participants);
            entriesThisRound += participants.length;
          }

          downloadedCount += entriesThisRound;
          updateDownloadProgress(downloadedCount, total);
        }

        console.log("✅ All participant data fetched:", allData);
        setFileDetails({ entries: total });
        setDownloadedData(allData);
        allData = [];
        setUploadStatus("attached");
        setIsDownloadingData(false);
        isActiveRef.current = false; // Stop countdown
        return true;
      } else {
        console.warn("⚠️ No participants found.");
        isActiveRef.current = false;
        return false;
      }
    } catch (error) {
      console.error("❌ Error downloading participant data:", error);
      setIsDownloadingData(false);
      isActiveRef.current = false;
      return false;
    }
  };

  const validRowsHeaders = [
    "id_entry",
    "full_name",
    "raffle_code",
    "regional_location",
    "registered_at"
  ]; // Allowed headers

  const countCsvRows = async (file: File): Promise<number> => {
    return new Promise((resolve) => {
      let rowCount = 0;
      let headersChecked = false;

      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        step: (results, parser) => {
          if (!headersChecked) {
            const headers = results.meta.fields ?? [];

            const hasInvalidHeaders = headers.some(
              (h) => !validRowsHeaders.includes(h.toLowerCase())
            );
            const tooManyColumns = headers.length > validRowsHeaders.length;

            if (hasInvalidHeaders || tooManyColumns) {
              parser.abort(); // stop parsing
              setIsFileValid(false);
              resolve(0);
              return;
            }

            setIsFileValid(true);
            headersChecked = true;
          }

          rowCount++;
        },
        complete: () => {
          resolve(rowCount);
        },
        error: () => {
          setIsFileValid(false);
          resolve(0);
        }
      });
    });
  };

  const checkCloudData = async () => {
    if (isServerActive) {
      const { total } = await getParticipantsTotalCount();
      if (total > 0) {
        setWithCloudData(true);
        console.log("With Cloud Data? ", total > 0);
      } else {
        setWithCloudData(false);
      }
    } else {
      setWithCloudData(false);
    }
  };

  useEffect(() => {
    checkCloudData();
  }, [isServerActive]);

  return (
    <div className={`upload-phase ${uploadStatus !== "idle" && "hidden"}`}>
      {!withCloudData ? (
        <>
          <UploadBox
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`${
              isDragging && "bg-gray-300 text-gray-800 animate-pulse"
            }`}
          >
            {isDragging ? (
              <p className="text-xl">Drop CSV File Here</p>
            ) : (
              <>
                <UploadBox.Body className="flex justify-center items-center flex-col gap-4">
                  <h2 className="text-base">
                    Drag and drop a CSV file here or <br /> click button below
                    to upload{" "}
                  </h2>
                  <p>
                    Upload a CSV file with the participants data. The file
                    should contain the following columns: Entry ID, Full Name,
                    Raffle Code, Region/Location.
                  </p>
                </UploadBox.Body>
                <UploadBox.Footer>
                  <div>
                    {!isFileValid && (
                      <span className="text-red-400 animate-pulse">
                        File is invalid. Try again in {fileValidityResetCounter}{" "}
                        seconds.
                      </span>
                    )}
                  </div>
                  <UploadButton onClick={handleFileUpload}>
                    Select & Attach File
                  </UploadButton>
                  <label htmlFor="file-upload" className="sr-only hidden">
                    Upload File
                  </label>
                  <input
                    type="file"
                    name="file-upload"
                    id="file-upload"
                    title="Upload a CSV file"
                    className="hidden"
                    ref={fileInputRef}
                    accept=".csv"
                    onChange={handleFileChange}
                  />
                </UploadBox.Footer>
              </>
            )}
          </UploadBox>
          {!isServerActive && (
            <div className="text-red-400 mt-4">
              <h2 className="text-xl">Server is Offline:</h2>
              <p>
                Turn on or connect to the server to double check if there is
                available data on the cloud
              </p>
            </div>
          )}
        </>
      ) : (
        <UploadBox className={`bg-amber-800`}>
          <>
            <UploadBox.Body className="flex justify-center items-center flex-col gap-4">
              <h2 className="text-base">
                Participants Data found in Database{" "}
              </h2>
              <p>
                Data can be downloaded. Click download button below to start.
              </p>
              <div>Progress: {downloadProgress}%</div>
              <div>Time Remaining: {formatShortTime(ETR)}</div>
            </UploadBox.Body>
            <UploadBox.Footer>
              <UploadButton onClick={handleStartDownloadData}>
                {isDownloadingData ? (
                  <span className="animate-pulse">Downloading...</span>
                ) : (
                  `Download Data to this app`
                )}
              </UploadButton>
            </UploadBox.Footer>
          </>
        </UploadBox>
      )}

      {/* {"################################## DOWNLOAD BOX BELOW ###################################"} */}
    </div>
  );
};

export default Phase01_Idle;
