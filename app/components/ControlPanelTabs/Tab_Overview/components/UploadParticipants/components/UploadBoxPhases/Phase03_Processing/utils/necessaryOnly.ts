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
