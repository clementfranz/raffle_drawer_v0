import React, { useEffect, useRef, useState } from "react";

// Other Packages
import Papa from "papaparse";

// Components
import UploadBox from "../../UploadBox/_main/UploadBox";
import UploadButton from "../../UploadButton/_main/UploadButton";
import { getParticipantsTotalCount } from "~/api/asClient/participants/getParticipantsTotalCount";
import { getPaginatedParticipants } from "~/api/asClient/participants/getPaginatedParticipants";
import useLocalStorageState from "use-local-storage-state";

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";

  const units = ["B", "KB", "MB", "GB", "TB"];
  const k = 1024;
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const size = bytes / Math.pow(k, i);

  return `${size % 1 === 0 ? size : size.toFixed(2)} ${units[i]}`;
}

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
  setTriggerImport: React.Dispatch<React.SetStateAction<boolean>>;
  setDownloadElapsedTime: React.Dispatch<React.SetStateAction<number>>;
  fileAttached: File | null;
};

const Phase01_Idle = ({
  setFileAttached,
  setFileDetails,
  setUploadStatus,
  uploadStatus,
  setCloudData,
  setTriggerImport,
  setDownloadElapsedTime,
  fileAttached
}: IdleProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

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
  const [isFileReading, setIsFileReading] = useState(false);

  useEffect(() => {
    if (!fileAttached && fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, [fileAttached]);

  const handleFileProcess = async (file: File) => {
    setIsFileReading(true);
    if (file.type === "text/csv") {
      setFileAttached(file);
      const rows = await countCsvRows(file);
      if (rows && isFileValid) {
        setUploadStatus("attached");
        setFileDetails({ entries: rows });
        setIsFileReading(false);
      } else {
        setFileAttached(null);

        let countdown = 4;

        const resetFileValidityCounter = setInterval(() => {
          setIsFileReading(false);
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
  const [ELT, setELT] = useState(0);

  const [totalCloudData, setTotalCloudData] = useState(0);

  const batchDurationsRef = useRef<number[]>([]);
  const prevDownloadedRef = useRef<number>(0);
  const prevTimestampRef = useRef<number>(Date.now());
  const MAX_SAMPLES = 10; // Keep recent 10 batches for moving average
  const isActiveRef = useRef(false); // Control countdown activity

  const downloadStartTimeRef = useRef<number | null>(null);
  const elapsedIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const updateDownloadProgress = (downloaded: number, total: number) => {
    const progress: number = (downloaded / total) * 100;
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
    isActiveRef.current = true;
    downloadStartTimeRef.current = Date.now();

    elapsedIntervalRef.current = setInterval(() => {
      if (downloadStartTimeRef.current) {
        const elapsedMs = Date.now() - downloadStartTimeRef.current;
        const elapsedSec = Math.floor(elapsedMs / 1000);
        setELT(elapsedSec);
        setDownloadElapsedTime(elapsedSec);
      }
    }, 1000);

    try {
      const { total } = await getParticipantsTotalCount();
      let allData: any[] = [];

      if (total && total > 0) {
        const batchSize = 2500;
        const totalBatches = Math.ceil(total / batchSize);
        const concurrencyLimit = 10;

        let downloadedCount = 0;
        let currentBatchIndex = 1;
        const allBatchResults: any[][] | null[] = new Array(totalBatches); // Track by index

        const fetchBatch = async (indexBatch: number) => {
          const response = await getPaginatedParticipants(
            indexBatch,
            batchSize
          );

          return response.data;
        };

        const worker = async () => {
          while (true) {
            const batchIndex = currentBatchIndex++;
            if (batchIndex > totalBatches) return;

            try {
              const participants = await fetchBatch(batchIndex);
              allBatchResults[batchIndex - 1] = participants;

              downloadedCount += participants.length;
              updateDownloadProgress(downloadedCount, total);
            } catch (err) {
              console.error(`❌ Failed batch ${batchIndex}:`, err);
              // Ensure empty array for failed batch to retry later if needed
              allBatchResults[batchIndex - 1] = null;
            }
          }
        };

        // Run concurrent workers
        const workers = Array.from({ length: concurrencyLimit }, () =>
          worker()
        );
        await Promise.all(workers);

        // Retry any failed batches once
        for (let i = 0; i < allBatchResults.length; i++) {
          if (allBatchResults[i] === null) {
            try {
              const retryData = await fetchBatch(i + 1);
              allBatchResults[i] = retryData;
              downloadedCount += retryData.length;
              updateDownloadProgress(downloadedCount, total);
            } catch (err) {
              console.error(`❌ Retry failed for batch ${i + 1}`, err);
              allBatchResults[i] = []; // Prevent undefined
            }
          }
        }

        // Combine final data
        allData = allBatchResults
          .flat()
          .sort((a, b) => a.id_entry - b.id_entry);

        console.log("😓😓😓😓😓😓 FINAL DATA: ", allData);

        if (allData.length !== total) {
          console.warn(
            `⚠️ Mismatch in expected vs actual data count. Expected: ${total}, Got: ${allData.length}`
          );
        }

        console.log("✅ All participant data fetched:", allData.length);
        setFileDetails({ entries: allData.length });
        setDownloadedData(allData);
        allData = [];

        setUploadStatus("processing");
        setTriggerImport(true);
        setIsDownloadingData(false);
        isActiveRef.current = false;
        if (elapsedIntervalRef.current) {
          clearInterval(elapsedIntervalRef.current);
          elapsedIntervalRef.current = null;
        }
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
      if (elapsedIntervalRef.current) {
        clearInterval(elapsedIntervalRef.current);
        elapsedIntervalRef.current = null;
      }
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
        setTotalCloudData(total);
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

  useEffect(() => {
    return () => {
      if (elapsedIntervalRef.current) {
        clearInterval(elapsedIntervalRef.current);
      }
    };
  }, []);

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
                  {isFileReading ? (
                    <UploadButton className="bg-red-800 hover:bg-red-800 animate-pulse text-white !cursor-not-allowed">
                      Reading File...
                    </UploadButton>
                  ) : !isFileValid ? (
                    <>
                      <UploadButton className="bg-red-800 hover:bg-red-800 animate-pulse text-white !cursor-not-allowed">
                        File is invalid. Try again in {fileValidityResetCounter}{" "}
                        seconds.
                      </UploadButton>
                    </>
                  ) : (
                    <UploadButton
                      onClick={() => {
                        if (isFileReading) {
                          return;
                        } else {
                          handleFileUpload();
                        }
                      }}
                    >
                      Select & Attach File
                    </UploadButton>
                  )}
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
        <UploadBox className={`bg-amber-600 overflow-hidden`}>
          <UploadBox.Body className="flex justify-center items-center flex-col gap-4 z-10">
            <h2 className="text-base">Participants Data found in Database </h2>
            {totalCloudData > 0 ? (
              <div>
                <p>
                  Total Participants from cloud:{" "}
                  <span className="font-bold">
                    {totalCloudData.toLocaleString()}
                  </span>
                </p>
                <p title="This estimate is not an accurate computation of exact size. ">
                  Estimated Size:{" "}
                  <span className="font-bold">
                    {formatBytes(totalCloudData * 70)}
                  </span>
                </p>
              </div>
            ) : (
              <p className="animate-pulse">
                Loading Total Count of Participants...
              </p>
            )}
            {!isDownloadingData && (
              <p>
                Data can be downloaded. Click download button below to start.
              </p>
            )}
          </UploadBox.Body>
          <UploadBox.Footer className="z-10">
            {isDownloadingData && (
              <div className="clock justify-between flex">
                <div className="bg-[#000000b0] p-1 px-2 text-sm rounded-2xl">
                  ⏱️ ELT: {formatShortTime(ELT)}
                </div>
                <div className="bg-[#000000b0] p-1 px-2 text-sm rounded-2xl">
                  ⏳ ETR: {formatShortTime(ETR)}
                </div>
              </div>
            )}
            <UploadButton
              onClick={handleStartDownloadData}
              className="!bg-[#0000009d]"
            >
              {isDownloadingData ? (
                <span className="animate-pulse">
                  Downloading - Progress: {downloadProgress.toFixed(2)}%
                </span>
              ) : (
                `Download Data to this app`
              )}
            </UploadButton>
          </UploadBox.Footer>
          <div className="progress-bar-shell absolute top-0 w-full h-full z-[0]">
            <div
              className="progress-bar bg-[#8d600086] w-full h-full"
              style={{ transform: `translateX(-${100 - downloadProgress}%)` }}
            ></div>
          </div>
        </UploadBox>
      )}

      {/* {"################################## DOWNLOAD BOX BELOW ###################################"} */}
    </div>
  );
};

export default Phase01_Idle;
