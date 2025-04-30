import React, { useState, useRef } from "react";

import Papa from "papaparse";
import type { IDBPDatabase } from "idb";
import { openDB } from "idb";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose } from "@fortawesome/free-solid-svg-icons";
import { width } from "@fortawesome/free-brands-svg-icons/fa42Group";

interface UploadParticipantsProps {
  uploadComplete: React.Dispatch<React.SetStateAction<boolean>>;
}

const UploadParticipants: React.FC<UploadParticipantsProps> = ({
  uploadComplete
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [attachedFile, setAttachedFile] = useState<File | null>(null);

  const [isUploading, setIsUploading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const [processingComplete, setProcessingComplete] = useState(false);

  const [progress, setProgress] = useState(0);
  const [totalRows, setTotalRows] = useState(0);
  const [status, setStatus] = useState("Upload");
  const [estimatedTime, setEstimatedTime] = useState<number | null>(null);
  let batchTimes: number[] = [];

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleUploadComplete = () => {
    uploadComplete(true); // Notify parent component that upload is complete
  };

  const handleFileUpload = async (event: any) => {
    setIsProcessing(true);
    const file = attachedFile;
    if (!file) return;

    setStatus("Counting rows...");
    setProgress(0);
    setEstimatedTime(null);

    // First pass: Count rows
    let rowCount = 0;

    await new Promise((resolve, reject) => {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        step: function () {
          rowCount++;
        },
        complete: function () {
          resolve(undefined);
        },
        error: function (error) {
          reject(error);
        }
      });
    });

    setTotalRows(rowCount);
    setStatus("Processing and saving...");

    // Now, second pass: Save data with progress
    let batch: Record<string, any>[] = [];
    let savedRows = 0;
    const batchSize = 1000;

    const db = await openDB("csvDB", 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains("csvStore")) {
          db.createObjectStore("csvStore", {
            keyPath: "id",
            autoIncrement: true
          });
        }
      }
    });

    await new Promise((resolve, reject) => {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        step: async function (results, parser) {
          batch.push(results.data as Record<string, any>);
          savedRows++;

          if (batch.length >= 1000) {
            parser.pause();
            await saveBatch(batch, db);
            batch = [];

            const avgTime =
              batchTimes.reduce((a, b) => a + b, 0) / batchTimes.length; // ⭐
            const batchesLeft = Math.ceil((rowCount - savedRows) / batchSize); // ⭐
            const timeLeft = Math.round((avgTime * batchesLeft) / 1000); // ⭐
            setEstimatedTime(timeLeft);

            setProgress(Math.round((savedRows / rowCount) * 100));
            parser.resume();
          }
        },
        complete: async function () {
          if (batch.length > 0) {
            await saveBatch(batch, db);
          }
          setProgress(100);
          setEstimatedTime(0);
          setStatus("Completed!");
          handleUploadComplete(); // Notify parent component that upload is complete
          setProcessingComplete(true);
          resolve(undefined);
        },
        error: function (error) {
          reject(error);
        }
      });
    });
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type === "text/csv") {
        console.log("CSV file selected:", file.name);
        setAttachedFile(file); // Update state with the selected file
        setFileName(file.name); // Update state with file name
      } else {
        alert("Please upload a valid CSV file.");
      }
    }
  };

  const resetFileAttachement = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // Clear the file input value
      setFileName(null);
      setAttachedFile(null); // Reset the attached file
      setProgress(0); // Reset progress
      setTotalRows(0); // Reset total rows
      setStatus("Upload"); // Reset status
      setIsProcessing(false); // Reset processing state
      setEstimatedTime(null); // Reset estimated time
    }
  };

  const saveBatch = async (batch: Record<string, any>[], db: IDBPDatabase) => {
    const start = performance.now();
    const tx = db.transaction("csvStore", "readwrite");
    const store = tx.objectStore("csvStore");
    for (const row of batch) {
      store.add(row);
    }
    await tx.done;
    const duration = performance.now() - start;
    batchTimes.push(duration);
  };

  return (
    <>
      <div className="flex flex-col gap-2 text-sm">
        <div className="message  text-gray-300 text-center italic hidden">
          No participants found.{" "}
        </div>
        <div className="upload-data">
          <p className="text-gray-300 text-sm mb-2">Upload participants data</p>
          <div
            className={`upload-data-shell bg-gray-950 p-4 border-dashed border-gray-500 rounded-lg border-2 text-center  transition-all duration-200 aspect-[5/4] flex flex-col justify-center items-center relative ${
              isDragging
                ? "bg-pink-700 border-gray-300 animate-pulse"
                : fileName
                ? "bg-green-500 text-black"
                : "hover:bg-gray-800 text-gray-300"
            }`}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              resetFileAttachement(); // Reset file attachment state
              setIsDragging(false);
              const files = e.dataTransfer.files;
              if (files.length > 0) {
                const file = files[0];
                if (file.type === "text/csv") {
                  console.log("CSV file dropped:", file.name);
                  setFileName(file.name); // Update state with file name
                  setAttachedFile(file); // Update state with the file
                } else {
                  alert("Please upload a valid CSV file.");
                }
              }
            }}
          >
            <div className="upper-part grow flex justify-center items-center flex-col gap-2 w-full z-10">
              <div className="text-sm w-full h-full">
                {isDragging ? (
                  "Drop the file here"
                ) : fileName ? (
                  <div className="bg-[#00000083] w-full h-full flex items-center justify-center rounded-xl text-gray-200 relative">
                    File selected: ${fileName}
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
                      <>{`${progress}%`}</>
                    )}
                  </div>
                ) : (
                  "Drag and drop a CSV file here or click to upload"
                )}
              </div>
              {!isDragging && !fileName && (
                <>
                  <p className="text-gray-300  mt-2 text-xs">
                    Upload a CSV file with the participants data. The file
                    should contain the following columns: Full Name, Alpha
                    Numeric Code, Region/Location.
                    <br />{" "}
                  </p>
                </>
              )}
            </div>
            <div className="lower-part w-full z-10">
              {!isDragging ? (
                fileName ? (
                  !isProcessing ? (
                    <button
                      className="bg-gray-600 hover:bg-gray-500 px-4 h-[40px] w-full text-center rounded-xl cursor-pointer mt-2 flex items-center justify-center gap-2 text-white"
                      onClick={handleFileUpload}
                    >
                      {status}
                    </button>
                  ) : (
                    <button
                      className="bg-gray-600  px-4 h-[40px] w-full text-center rounded-xl cursor-not-allowed mt-2 flex items-center justify-center gap-2 text-white"
                      disabled
                    >
                      {status}
                    </button>
                  )
                ) : (
                  <button
                    className="bg-gray-600 hover:bg-gray-500 px-4 h-[40px] w-full text-center rounded-xl cursor-pointer mt-2 flex items-center justify-center gap-2"
                    onClick={() =>
                      document.getElementById("fileInput")?.click()
                    }
                  >
                    Select and Attach File
                  </button>
                )
              ) : null}
            </div>
            <div
              className="progress-filler bg-green-300 absolute top-0 left-0 h-full transition-all ease-linear -z-0"
              style={width ? { width: `${progress}%` } : {}}
              aria-label="Progress Filler"
            ></div>
            <input
              type="file"
              id="fileInput"
              accept=".csv"
              className="hidden"
              ref={fileInputRef}
              aria-label="Upload CSV file"
              onChange={(e) => {
                handleFileChange(e);
              }}
            />
          </div>
          <div className="flex flex-col justify-end items-center gap-2">
            <div className="progress-bar w-full bg-gray-700 h-[10px] rounded-full mt-2">
              <p className="text-gray-300 text-xs"></p>
            </div>
            <p>Total Entries: {totalRows.toLocaleString()}</p>
            {estimatedTime !== null &&
              estimatedTime > 0 && ( // ⭐
                <p>Estimated time remaining: {estimatedTime} seconds</p> // ⭐
              )}
          </div>
        </div>
      </div>
    </>
  );
};

export default UploadParticipants;
