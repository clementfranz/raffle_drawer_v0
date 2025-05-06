import { type Dispatch, type SetStateAction } from "react";

// Packages
import Papa from "papaparse";
import { openDB, deleteDB, wrap, unwrap, type IDBPDatabase } from "idb";

type Participant = {
  id_entry: string;
  full_name: string;
  raffle_code: string;
  regional_location: string;
  time_registered: string;
};

export const formatFileSize = (bytes: number): string => {
  const units = ["B", "KB", "MB", "GB", "TB"];
  let size = bytes;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }

  return `${size.toFixed(2)} ${units[unitIndex]}`;
};

export const savePerBatch = async (
  db: IDBPDatabase<unknown>,
  storeName: string,
  batch: Participant[]
) => {
  const tx = db.transaction(storeName, "readwrite");
  const store = tx.objectStore(storeName);

  for (const row of batch) {
    // Validate again before saving
    if (
      row.id_entry &&
      row.full_name &&
      row.raffle_code &&
      row.regional_location &&
      row.time_registered
    ) {
      store.put(row);
    }
  }

  await tx.done;
};

export const importCsvToIndexedDB = async (
  file: File,
  specialCode: string,
  batchSize: number,
  setEntriesProcessed: Dispatch<SetStateAction<number>>,
  setUploadProgress: Dispatch<SetStateAction<number>>,
  setPreUploadLoading: Dispatch<SetStateAction<boolean>>
) => {
  setPreUploadLoading(true);
  const dbName = "ParticipantsDB";

  // Try opening the database — if doesn't exist, start at version 1
  let currentVersion = 1;

  try {
    const dbTemp = await openDB(dbName);
    currentVersion = dbTemp.version;
    dbTemp.close();
  } catch (e) {
    // No existing DB, so start fresh
    console.log("No existing DB found. Starting new one.");
  }

  // Open the database with correct version (increment)
  const db = await openDB(dbName, currentVersion + 1, {
    upgrade(db) {
      const storeName = `participantsData_${specialCode}`;
      if (!db.objectStoreNames.contains(storeName)) {
        const store = db.createObjectStore(storeName, {
          keyPath: "id",
          autoIncrement: true
        });
        store.createIndex("id_entry", "id_entry", { unique: true });
      }
    }
  });

  const storeName = `participantsData_${specialCode}`;
  let batch: Participant[] = [];
  let totalRows = 0;
  let entriesInserted = 0;

  // Count rows first
  const countTotalRows = (): Promise<number> => {
    return new Promise((resolve, reject) => {
      let count = 0;
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        step: () => count++,
        complete: () => resolve(count),
        error: (err) => reject(err)
      });
    });
  };

  totalRows = await countTotalRows();

  return new Promise<void>((resolve, reject) => {
    setPreUploadLoading(false);
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      step: async (results, parser) => {
        const row = results.data as Participant;

        batch.push(row);
        entriesInserted += 1;

        // ✅ Real-time update on every row
        setEntriesProcessed(entriesInserted);
        setUploadProgress(Math.round((entriesInserted / totalRows) * 100));

        if (batch.length >= batchSize) {
          parser.pause();

          await savePerBatch(db, storeName, batch);

          batch = [];
          parser.resume();
        }
      },
      complete: async () => {
        // Save remaining
        if (batch.length > 0) {
          await savePerBatch(db, storeName, batch);
        }

        // Final update
        setEntriesProcessed(entriesInserted);
        setUploadProgress(100);

        console.log("CSV import completed");
        resolve();
      },
      error: (err) => {
        console.error("CSV parsing failed", err);
        reject(err);
      }
    });
  });
};
