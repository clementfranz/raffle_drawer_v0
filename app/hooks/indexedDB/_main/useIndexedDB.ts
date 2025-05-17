import { openDB, type DBSchema, type IDBPDatabase } from "idb";
import { migrateParticipantBatch } from "../migrations/migrate_ParticipantBatch";
import { migrateParticipant } from "../migrations/migrate_Participant";
import { migrateWinnerParticipant } from "../migrations/migrate_WinnerParticipant";

import type * as Types from "../types";
import { fullNameCleaner } from "~/utils/fullNameCleaner";
import { migrateSyncCloud } from "../migrations/migrate_SyncCloud";

const DB_NAME = "RaffleDrawDB";
const DB_VERSION = 17;

let dbPromise: Promise<IDBPDatabase<RaffleDBSchema>> | null = null;

interface ParticipantBatch {
  id: string;
  batch_name: string;
  // Other fields specific to a participant batch
}

interface RaffleDBSchema extends DBSchema {
  participantsBatch: {
    key: string;
    value: ParticipantBatch;
  };
  participant: {
    key: string | number;
    value: Types.ParticipantTypes.Participant;
    indexes: {
      id: number;
      participant_batch_id: string;
      regional_location: string;
      id_entry: string;
      is_drawn: string;
      raffle_code: string;
      region_drawn: string;
      entry_drawn: any;
    };
  };
  winnerParticipant: {
    key: string;
    value: Types.WinnerParticipantTypes.WinnerParticipant;
    indexes: {
      winner_type: string;
      id_entry: string;
      raffle_code: string;
      winner_type_draw_date: any;
    };
  };
  syncCloud: {
    key: string | number;
    value: Types.SyncCloudTypes.SyncCloud;
    indexes: {
      createdAt: string | Date;
      id: number;
      status_createdAt: any;
    };
  };
}

export function initDB(): Promise<IDBPDatabase<RaffleDBSchema>> {
  if (dbPromise) return dbPromise;

  dbPromise = openDB<RaffleDBSchema>(DB_NAME, DB_VERSION, {
    upgrade(db) {
      console.log("Running onupgradeneeded for DB version:", DB_VERSION);
      migrateParticipantBatch(db);
      migrateParticipant(db);
      migrateWinnerParticipant(db);
      migrateSyncCloud(db);
    }
  });

  return dbPromise as Promise<IDBPDatabase<RaffleDBSchema>>;
}

type StoreName =
  | "participantsBatch"
  | "participant"
  | "winnerParticipant"
  | "syncCloud";
type StoreData = any;

export async function create(storeName: StoreName, data: StoreData) {
  const db = await initDB();
  return db.add(storeName, data);
}

export async function read<T>(
  storeName: StoreName,
  id: IDBValidKey
): Promise<T | null> {
  const db = await initDB();
  const result = await db.get(storeName, id as string);
  return (result as T) ?? null;
}

export async function readAll<T>(storeName: StoreName): Promise<T[]> {
  const db = await initDB();
  const result = await db.getAll(storeName);
  return result as T[];
}

export async function update(
  storeName: StoreName,
  id: IDBValidKey,
  updatedData: StoreData
): Promise<StoreData | null> {
  const existing = await read<StoreData>(storeName, id);
  if (!existing) throw new Error("Item not found");

  const db = await initDB();
  const updated = { ...existing, ...updatedData };
  return db.put(storeName, updated);
}

export async function deleteItem(storeName: StoreName, id: IDBValidKey) {
  const db = await initDB();
  return db.delete(storeName, id as string);
}

export async function deleteAllItems(storeName: StoreName): Promise<boolean> {
  try {
    const db = await initDB();
    const tx = db.transaction(storeName, "readwrite");
    await tx.store.clear();
    await tx.done;
    return true;
  } catch (error) {
    console.error("Failed to delete all items:", error);
    return false;
  }
}

export async function emptyStore(storeName: StoreName): Promise<boolean> {
  try {
    const db = await initDB();
    const tx = db.transaction(storeName, "readwrite");
    await tx.store.clear();
    await tx.done;
    return true;
  } catch (error) {
    console.error(`❌ Failed to clear store "${storeName}":`, error);
    return false;
  }
}

export async function deleteStoreWithProgress(
  storeName: StoreName,
  batchSize: number,
  onProgress: (deletedCount: number, totalCount: number) => void
): Promise<void> {
  const db = await initDB();
  const tx = db.transaction(storeName, "readwrite");
  const store = tx.store;

  const totalCount = await store.count();
  let deletedCount = 0;

  let cursor = await store.openCursor();

  while (cursor) {
    for (let i = 0; i < batchSize && cursor; i++) {
      await cursor.delete();
      deletedCount++;
      cursor = await cursor.continue();
    }

    onProgress(deletedCount, totalCount);

    // No timeout here
  }

  await tx.done;
}

export async function countEntriesByLocationWithProgress(
  setCountProgress: (progress: number) => void
): Promise<{
  totalParticipants: number;
  dailyAverage: number;
  regions: { location: string; count: number }[];
}> {
  const db = await initDB();
  const storeName: StoreName = "participant";
  const batchSize = 1000;

  const totalEntries = await db.count(storeName);

  const locationMap = new Map<string, number>();
  let processed = 0;

  // Date range tracking using `registered_at`
  let earliestDate: number | null = null;
  let latestDate: number | null = null;

  return new Promise(async (resolve, reject) => {
    try {
      let cursor = await db
        .transaction(storeName, "readonly")
        .objectStore(storeName)
        .openCursor();

      while (cursor) {
        const entry = cursor.value;
        const location = entry.regional_location;

        if (location) {
          locationMap.set(location, (locationMap.get(location) || 0) + 1);
        }

        // Use registered_at for date range
        if (entry.registered_at) {
          const registeredAt = new Date(entry.registered_at).getTime();
          if (!earliestDate || registeredAt < earliestDate)
            earliestDate = registeredAt;
          if (!latestDate || registeredAt > latestDate)
            latestDate = registeredAt;
        }

        processed++;

        if (processed % batchSize === 0) {
          const progress = Math.min(
            parseFloat(((processed / totalEntries) * 100).toFixed(2)),
            100
          );
          setCountProgress(progress);
        }

        cursor = await cursor.continue();
      }

      setCountProgress(
        Math.min(parseFloat(((processed / totalEntries) * 100).toFixed(2)), 100)
      );

      let dailyAverage = 0;
      if (earliestDate && latestDate && latestDate > earliestDate) {
        const days = Math.max(
          1,
          Math.ceil((latestDate - earliestDate) / (1000 * 60 * 60 * 24))
        );
        dailyAverage = parseFloat((totalEntries / days).toFixed(2));
      }

      const result = Array.from(locationMap.entries()).map(
        ([location, count]) => ({
          location,
          count
        })
      );

      resolve({
        totalParticipants: totalEntries,
        dailyAverage,
        regions: result
      });
    } catch (error) {
      reject("Failed during location counting.");
    }
  });
}

export async function getAllParticipantsPerPage(
  batchCode: string,
  pageNth: number,
  rangeSize: number
): Promise<any[]> {
  console.log("Page No: ", pageNth);
  console.log("Number of rows per page: ", rangeSize);

  const db = await initDB();
  const store = db
    .transaction("participant", "readonly")
    .objectStore("participant");

  // Get the lowest key in the store dynamically
  const cursor = await store.openCursor();
  if (!cursor) {
    // Store is empty
    return [];
  }

  const lowestId = cursor.key as number;

  const skip = (pageNth - 1) * rangeSize;
  const startId = lowestId + skip;
  const endId = lowestId + skip + rangeSize - 1;
  try {
    // Use getAll with range 🚀
    const participants = await store.getAll(IDBKeyRange.bound(startId, endId));
    return participants;
  } catch (error) {
    console.error("Error fetching participants for page:", error);
    console.log("PAGE: ", pageNth, " RANGE: ", rangeSize);
    throw new Error("Failed to retrieve participants for page.");
  }
}

export async function getAllWinnerPerType(type: string): Promise<any[]> {
  console.log("Getting winners with type:", type, "...");

  const db = await initDB();
  const storeName: StoreName = "winnerParticipant";

  const winners: any[] = [];

  try {
    const transaction = db.transaction(storeName, "readonly");
    const store = transaction.objectStore(storeName);

    const index = store.index("winner_type_draw_date");

    // For strings, lowest possible "" (empty string) and highest "\uffff"
    const range = IDBKeyRange.bound([type, ""], [type, "\uffff"]);

    // Open cursor in 'prev' direction (newest first)
    let cursor = await index.openCursor(range, "prev");

    while (cursor) {
      winners.push(cursor.value);
      cursor = await cursor.continue();
    }

    return winners;
  } catch (error) {
    console.error("Error fetching winners for page:", error);
    throw new Error("Failed to retrieve winners for page.");
  }
}

export async function hasAnyParticipants(): Promise<boolean> {
  const db = await initDB();
  const count = await db.count("participant");
  return count > 0;
}

export async function getTotalParticipants(): Promise<number> {
  const db = await initDB();
  const count = await db.count("participant");
  return count - 1;
}

export async function hasAnyWinners(winnerType: string): Promise<boolean> {
  const db = await initDB();
  const tx = db.transaction("winnerParticipant", "readonly");
  const store = tx.objectStore("winnerParticipant");
  const index = store.index("winner_type");

  const count = await index.count(IDBKeyRange.only(winnerType));

  return count > 0;
}

// Helper: generate random index number
function generateRandomIndex(minNumber: number, maxNumber: number): number {
  console.log("Total Matches for specified region: ", maxNumber);
  console.log("Choosing from ", minNumber, " to ", maxNumber);
  return Math.floor(Math.random() * (maxNumber - minNumber)) + minNumber;
}

async function getWinnersRaffleCodes(): Promise<string[]> {
  const db = await initDB();
  const tx = db.transaction("winnerParticipant", "readonly");
  const store = tx.objectStore("winnerParticipant");
  const index = store.index("raffle_code");

  const raffleCodes: string[] = [];

  // Open a cursor to iterate over all entries
  let cursor = await index.openCursor();

  while (cursor) {
    if (cursor.value && cursor.value.raffle_code) {
      raffleCodes.push(cursor.value.raffle_code);
    }
    cursor = await cursor.continue();
  }

  return raffleCodes;
}

async function getParticipantsByRegion(
  region: string
): Promise<Types.ParticipantTypes.Participant[]> {
  console.log("Getting participants by region: ", region);

  const db = await initDB();
  const tx = db.transaction("participant", "readonly");
  const store = tx.objectStore("participant");

  const result: Types.ParticipantTypes.Participant[] = [];

  // Use compound index for fast filtering
  console.log("Filtering by region AND is_drawn true");
  const index = store.index("region_drawn");
  const range = IDBKeyRange.only([region, "false"]);
  let cursor = await index.openCursor(range);

  while (cursor) {
    result.push(cursor.value as Types.ParticipantTypes.Participant);
    cursor = await cursor.continue();
  }

  return result;
}

const lastResortWinnerFinderByIdEntry =
  async (): Promise<Types.ParticipantTypes.Participant | null> => {
    const db = await initDB();
    const tx = db.transaction("participant", "readonly");
    const store = tx.objectStore("participant");

    const index = store.index("is_drawn");
    const firstUndrawn = await index.get("false"); // get the first participant where is_drawn === "false"

    return firstUndrawn ?? null;
  };

async function getFirstParticipant(): Promise<string | null> {
  const db = await initDB();
  const tx = db.transaction("participant", "readonly");
  const store = tx.objectStore("participant");

  const cursor = await store.openCursor(); // gets the first row automatically
  if (cursor) {
    console.log("Getting first participant as starting point:", cursor.value);
    return cursor.value.id_entry ?? null;
  }

  return null; // if the store is empty
}

async function getParticipantByIdEntry(
  id_entry: string
): Promise<Types.ParticipantTypes.Participant | null> {
  const db = await initDB();
  const tx = db.transaction("participant", "readonly");
  const store = tx.objectStore("participant");

  const index = store.index("entry_drawn");
  const request = await index.get([id_entry, "false"]); // compound key lookup

  return request ?? null;
}

export async function pickRandomParticipant(
  favorableRegion?: string
): Promise<Types.ParticipantTypes.Participant> {
  console.log(
    favorableRegion
      ? `Favorable Region Set: ${favorableRegion}`
      : "No favorable region set"
  );

  let chosenParticipant: Types.ParticipantTypes.Participant | null = null;

  if (favorableRegion) {
    const filteredParticipants = await getParticipantsByRegion(favorableRegion);

    if (filteredParticipants.length === 0) {
      throw new Error(`No participants found in region: ${favorableRegion}`);
    }

    let randomIndex: number | null = null;

    while (!chosenParticipant) {
      const randomIndex = Math.floor(
        Math.random() * filteredParticipants.length
      );
      chosenParticipant = filteredParticipants[randomIndex] || null;

      if (!chosenParticipant) {
        console.log(
          `Participant not found at index: ${randomIndex}, retrying...`
        );
      }
    }
  } else {
    const totalParticipants = await getTotalParticipants();

    if (!totalParticipants || totalParticipants === 0) {
      throw new Error("No participants available.");
    }

    let randomId: string | null = null;
    let tries: number = 0;
    const minIdOfParticipants = await getFirstParticipant();

    while (!chosenParticipant && tries < 5 && minIdOfParticipants) {
      const randomId = generateRandomIndex(
        Number(minIdOfParticipants),
        totalParticipants + Number(minIdOfParticipants)
      ).toString();
      chosenParticipant = await getParticipantByIdEntry(randomId);

      if (!chosenParticipant) {
        console.log(
          `Participant not found with ID entry: ${randomId}, retrying...`
        );
        tries++;
      }
    }

    // If after 5 tries no participant was found, call lastResort
    if (!chosenParticipant) {
      console.log("Max retries reached. Calling lastResort()...");
      const lastResort = await lastResortWinnerFinderByIdEntry();
      chosenParticipant = lastResort;
      if (!chosenParticipant) {
        throw new Error(`Participant not found with ID entry: ${randomId}`);
      }
    }
  }

  chosenParticipant = {
    ...chosenParticipant,
    full_name_raw: chosenParticipant.full_name,
    full_name: fullNameCleaner(chosenParticipant.full_name)
  };

  return chosenParticipant;
}
