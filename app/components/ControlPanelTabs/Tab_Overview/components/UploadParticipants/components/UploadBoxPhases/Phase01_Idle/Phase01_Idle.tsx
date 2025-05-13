import React, { useEffect, useRef, useState } from "react";

// Other Packages
import Papa from "papaparse";

// Components
import UploadBox from "../../UploadBox/_main/UploadBox";
import UploadButton from "../../UploadButton/_main/UploadButton";
import { getParticipantsTotalCount } from "~/api/client/participants/getParticipantsTotalCount";
import { getPaginatedParticipants } from "~/api/client/participants/getPaginatedParticipants";
import useLocalStorageState from "use-local-storage-state";

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

  // DRAG STATES
  const [isDragging, setIsDragging] = useState(false);
  const [downloadedData, setDownloadedData] = useState<any[]>([]);
  const [withCloudData, setWithCloudData] = useLocalStorageState<boolean>(
    "withCloudData",
    { defaultValue: false }
  );
  const [isDownloadingData, setIsDownloadingData] = useState(false);

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

  const handleFileProcess = async (file: File) => {
    if (file.type === "text/csv") {
      setFileAttached(file);
      setUploadStatus("attached");
      const rows = await countCsvRows(file);
      setFileDetails({ entries: rows });
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

  const handleFileUpload = () => {
    fileInputRef.current?.click();
  };

  const handleDownloadData = async () => {
    if (isDownloadingData) {
      return;
    }
    setIsDownloadingData(true);
    try {
      const { total } = await getParticipantsTotalCount();
      let allData: any[] = []; // to store all fetched participants

      if (total && total > 0) {
        const batchSize = 2500;
        const totalBatches = Math.ceil(total / batchSize);

        for (let indexBatch = 1; indexBatch <= totalBatches; indexBatch++) {
          const response = await getPaginatedParticipants(
            indexBatch,
            batchSize
          );
          const participants = response.data; // assuming .data is the actual array
          allData = [...allData, ...participants];
        }

        // Now allData contains the complete participant list
        console.log("✅ All participant data fetched:", allData);
        setFileDetails({ entries: total });
        setDownloadedData(allData);
        setUploadStatus("attached");
        setIsDownloadingData(false);
        return allData; // return as an object (array of data)
      } else {
        console.warn("⚠️ No participants found.");
        return []; // return empty array
      }
    } catch (error) {
      console.error("❌ Error downloading participant data:", error);
      return []; // return empty array on failure too
    }
  };

  const countCsvRows = (file: File): Promise<number> => {
    return new Promise((resolve, reject) => {
      let rowCount = 0;

      Papa.parse(file, {
        header: true, // ✅ Skip the header row
        skipEmptyLines: true,
        step: () => {
          rowCount++;
        },
        complete: () => {
          resolve(rowCount);
        },
        error: (error) => {
          reject(error);
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
            </UploadBox.Body>
            <UploadBox.Footer>
              <UploadButton onClick={handleDownloadData}>
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
