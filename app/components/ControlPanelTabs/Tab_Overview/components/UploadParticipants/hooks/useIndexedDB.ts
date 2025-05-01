import { useState, useEffect } from "react";
import { openDB } from "idb"; // idb library to simplify IndexedDB usage
import type { Entry } from "../types/entry";

import type { IDBPDatabase } from "idb"; // Import the correct type from idb

interface IndexedDBHook {
  openDatabase: () => Promise<IDBPDatabase<unknown>>;
  saveBatchToIndexedDB: (
    db: IDBPDatabase<unknown>,
    batch: Entry[]
  ) => Promise<void>;
  getBatchEntriesByRange: (
    db: IDBPDatabase<unknown>,
    startingRange: number,
    endingRange: number
  ) => Promise<Entry[]>;
  getBatchEntriesByRegionAndRange: (
    db: IDBDatabase,
    region: string,
    startingRange: number,
    endingRange: number
  ) => Promise<Entry[]>;
}

export const useIndexedDB = (): IndexedDBHook => {
  // State to track if the DB is initialized
  const [dbInitialized, setDbInitialized] = useState<boolean>(false);

  // Open the IndexedDB database (only once)
  const openDatabase = async () => {
    const db = await openDB("MyDatabase", 1, {
      upgrade(db) {
        // Create object store and indexes if not already present
        const store = db.createObjectStore("entries", { keyPath: "id_entry" });
        store.createIndex("id_entry", "id_entry", { unique: true });
        store.createIndex("region", "region"); // Index for region queries
      }
    });
    setDbInitialized(true);
    return db;
  };

  // Save a batch of entries to IndexedDB
  const saveBatchToIndexedDB = async (
    db: IDBPDatabase<unknown>,
    batch: Entry[]
  ) => {
    const tx = db.transaction("entries", "readwrite");
    const store = tx.objectStore("entries");
    for (const entry of batch) {
      await store.put(entry); // Using put to insert/update the entry
    }
    await tx.done; // Ensure the transaction is finished
  };

  // Fetch entries by a range of id_entry values
  const getBatchEntriesByRange = async (
    db: IDBPDatabase<unknown>,
    startingRange: number,
    endingRange: number
  ) => {
    const tx = db.transaction("entries", "readonly");
    const store = tx.objectStore("entries");
    const index = store.index("id_entry");
    const range = IDBKeyRange.bound(startingRange, endingRange, false, false); // Create range query

    // Get all entries within the range
    return (await index.getAll(range)) as Entry[];
  };

  // Fetch entries by region and id_entry range
  const getBatchEntriesByRegionAndRange = async (
    db: IDBDatabase,
    region: string,
    startingRange: number,
    endingRange: number
  ) => {
    const tx = db.transaction("entries", "readonly");
    const store = tx.objectStore("entries");
    const index = store.index("region"); // Use region index

    // Create range for id_entry and apply filter for region
    const range = IDBKeyRange.bound(startingRange, endingRange, false, false);
    const entries: Entry[] = [];

    // Iterate over all records in the range and filter by region
    const cursorRequest = store.openCursor(range);
    return new Promise<Entry[]>((resolve) => {
      cursorRequest.onsuccess = (event) => {
        const cursor = (event.target as IDBRequest)?.result;
        if (!cursor) {
          resolve(entries); // Resolve when all entries have been processed
          return;
        }
        if (cursor) {
          const entry = cursor.value;
          if (entry.region === region) {
            entries.push(entry);
          }
          cursor.continue();
        } else {
          resolve(entries); // Resolve when all entries have been processed
        }
      };
    });
  };

  // Use effect to ensure the DB is initialized when the hook is first used
  useEffect(() => {
    if (!dbInitialized) {
      openDatabase();
    }
  }, [dbInitialized]);

  return {
    openDatabase,
    saveBatchToIndexedDB,
    getBatchEntriesByRange,
    getBatchEntriesByRegionAndRange
  };
};
