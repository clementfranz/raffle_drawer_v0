import React, { useState } from "react";

import Papa from "papaparse";
import type { IDBPDatabase } from "idb";
import { openDB } from "idb";

const UploadParticipants = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);

  const [progress, setProgress] = useState(0);
  const [totalRows, setTotalRows] = useState(0);
  const [status, setStatus] = useState("Upload");
  const [estimatedTime, setEstimatedTime] = useState<number | null>(null);
  let batchTimes: number[] = [];

  const handleFileChange = async (event: any) => {
    const file = event.target.files[0];
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
          resolve(undefined);
        },
        error: function (error) {
          reject(error);
        }
      });
    });
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
        <div className="message  text-gray-300 text-center italic">
          No participants found.{" "}
        </div>
        <div className="upload-data">
          <p className="text-gray-300 text-sm mb-2">Upload participants data</p>
          <div
            className={`upload-data-shell bg-gray-950 p-4 border-dashed border-gray-500 rounded-lg border-2 text-center cursor-pointer transition-all duration-200 h-[100px] flex flex-col justify-center items-center ${
              isDragging
                ? "bg-pink-700 border-gray-300 animation-pulse"
                : fileName
                ? "bg-green-600 text-black"
                : "hover:bg-gray-800 text-gray-300"
            }`}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setIsDragging(false);
              const files = e.dataTransfer.files;
              if (files.length > 0) {
                const file = files[0];
                if (file.type === "text/csv") {
                  console.log("CSV file dropped:", file.name);
                  setFileName(file.name); // Update state with file name
                  // Handle file processing here
                } else {
                  alert("Please upload a valid CSV file.");
                }
              }
            }}
            onClick={() => document.getElementById("fileInput")?.click()}
          >
            <p className="text-sm">
              {isDragging
                ? "Drop the file here"
                : fileName
                ? `File selected: ${fileName}`
                : "Drag and drop a CSV file here or click to upload"}
            </p>
            <input
              type="file"
              id="fileInput"
              accept=".csv"
              className="hidden"
              aria-label="Upload CSV file"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  if (file.type === "text/csv") {
                    console.log("CSV file selected:", file.name);
                    setFileName(file.name); // Update state with file name
                    // Handle file processing here
                    handleFileChange(e);
                  } else {
                    alert("Please upload a valid CSV file.");
                  }
                }
              }}
            />
          </div>
          <p className="text-gray-300  mt-2 text-xs">
            Upload a CSV file with the participants data. The file should
            contain the following columns: Full Name, Alpha Numeric Code,
            Region/Location.
            <br />{" "}
          </p>
          <div className="flex flex-col justify-end items-center gap-2">
            <button className="bg-gray-600 hover:bg-gray-500 px-4 h-[40px] rounded-2xl cursor-pointer mt-2 flex items-center gap-2">
              {status}
            </button>
            <div className="progress-bar w-full bg-gray-700 h-[10px] rounded-full mt-2">
              <div
                className="progress bg-pink-500 h-full rounded-full"
                style={{ width: `${progress}%` }}
              ></div>
              <p className="text-gray-300 text-xs">{`${progress}%`}</p>
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
