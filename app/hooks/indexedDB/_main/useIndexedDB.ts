import { openDB, type DBSchema, type IDBPDatabase } from "idb";
import { migrateParticipantBatch } from "../migrations/migrate_ParticipantBatch";
import { migrateParticipant } from "../migrations/migrate_Participant";
import { migrateWinnerParticipant } from "../migrations/migrate_WinnerParticipant";

import type * as Types from "../types";

const DB_NAME = "RaffleDrawDB";
const DB_VERSION = 10;

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
    key: string;
    value: Types.ParticipantTypes.Participant;
    indexes: {
      participant_batch_id: string;
      regional_location: string;
      id_entry: string;
    };
  };
  winnerParticipant: {
    key: string;
    value: Types.WinnerParticipantTypes.WinnerParticipant;
    indexes: { winner_type: string; id_entry: string; raffle_code: string };
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
    }
  });

  return dbPromise as Promise<IDBPDatabase<RaffleDBSchema>>;
}

type StoreName = "participantsBatch" | "participant" | "winnerParticipant";
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

export async function countEntriesByLocationWithProgress(
  setCountProgress: (progress: number) => void
): Promise<{ location: string; count: number }[]> {
  const db = await initDB();
  const storeName: StoreName = "participant";
  const batchSize = 1000;

  // 1st pass: Count total entries
  const totalEntries = await db.count(storeName);

  // 2nd pass: Count entries by location in batches
  const locationMap = new Map<string, number>();
  let processed = 0;

  return new Promise(async (resolve, reject) => {
    try {
      let cursor = await db
        .transaction(storeName, "readonly")
        .objectStore(storeName)
        .openCursor();

      while (cursor) {
        const location = cursor.value.regional_location;
        if (location) {
          locationMap.set(location, (locationMap.get(location) || 0) + 1);
        }

        processed++;

        // Only update progress per batch
        if (processed % batchSize === 0) {
          const progress = Math.min(
            parseFloat(((processed / totalEntries) * 100).toFixed(2)),
            100
          );
          setCountProgress(progress);
        }

        cursor = await cursor.continue();
      }

      // Final batch update
      const finalProgress = Math.min(
        parseFloat(((processed / totalEntries) * 100).toFixed(2)),
        100
      );
      setCountProgress(finalProgress);

      const result = Array.from(locationMap.entries()).map(
        ([location, count]) => ({
          location,
          count
        })
      );
      resolve(result);
    } catch (error) {
      reject("Failed during location counting.");
    }
  });
}

export async function getAllParticipantsPerPage(
  participantBatchId: string,
  pageNth: number,
  rangeSize: number
): Promise<any[]> {
  console.log("Getting data from batch: ", participantBatchId);
  console.log("Page No: ", pageNth);
  console.log("Number of rows per page: ", rangeSize);

  const db = await initDB();
  const storeName: StoreName = "participant";

  const skip = (pageNth - 1) * rangeSize;
  const limit = rangeSize;

  const participants: any[] = [];

  try {
    const transaction = db.transaction(storeName, "readonly");
    const store = transaction.objectStore(storeName);

    const index = store.index("participant_batch_id");
    let cursor = await index.openCursor(
      IDBKeyRange.only(participantBatchId),
      "next"
    );

    let skipped = 0;

    while (cursor) {
      // Skip until we reach the start of the page
      if (skipped < skip) {
        skipped++;
        cursor = await cursor.continue();
        continue;
      }

      // If we've collected enough, break
      if (participants.length >= limit) {
        break;
      }

      // Collect participant
      participants.push(cursor.value);

      cursor = await cursor.continue();
    }

    return participants;
  } catch (error) {
    console.error("Error fetching participants for page:", error);
    throw new Error("Failed to retrieve participants for page.");
  }
}

export async function getAllWinnerPerType(type: string): Promise<any[]> {
  console.log("Getting winners with type: ", type, "...");

  const db = await initDB();
  const storeName: StoreName = "winnerParticipant";

  const winners: any[] = [];

  try {
    const transaction = db.transaction(storeName, "readonly");
    const store = transaction.objectStore(storeName);

    const index = store.index("winner_type");

    let cursor = await index.openCursor(IDBKeyRange.only(type), "next");

    while (cursor) {
      winners.push(cursor.value); // Collect this winner
      cursor = await cursor.continue(); // Move to next
    }
  } catch (error) {
    console.error("Error fetching winners for page:", error);
    throw new Error("Failed to retrieve winners for page.");
  }

  return winners;
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
function generateRandomIndex(maxNumber: number): number {
  console.log("Total Matches for specified region: ", maxNumber);
  return Math.floor(Math.random() * maxNumber);
}

async function getParticipantsByRegion(
  region: string
): Promise<Types.ParticipantTypes.Participant[]> {
  console.log("Getting participants by region: ", region);

  const db = await initDB();
  const tx = db.transaction("participant", "readonly");
  const store = tx.objectStore("participant");

  const result: Types.ParticipantTypes.Participant[] = [];

  // Use index for fast filtering
  console.log("Filtering regions");
  const index = store.index("regional_location");
  const range = IDBKeyRange.only(region);
  let cursor = await index.openCursor(range);

  while (cursor) {
    result.push(cursor.value as Types.ParticipantTypes.Participant);
    cursor = await cursor.continue();
  }

  return result;
}

async function getParticipantByIdEntry(
  id_entry: string
): Promise<Types.ParticipantTypes.Participant | null> {
  const db = await initDB();
  const tx = db.transaction("participant", "readonly");
  const store = tx.objectStore("participant");

  const index = store.index("id_entry");
  const request = await index.get(id_entry);

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

    const randomIndex = generateRandomIndex(filteredParticipants.length);
    chosenParticipant = filteredParticipants[randomIndex];
  } else {
    const totalParticipants = await getTotalParticipants();

    if (!totalParticipants || totalParticipants === 0) {
      throw new Error("No participants available.");
    }

    const randomId = generateRandomIndex(totalParticipants).toString();
    chosenParticipant = await getParticipantByIdEntry(randomId);

    if (!chosenParticipant) {
      throw new Error(`Participant not found with ID entry: ${randomId}`);
    }
  }

  return chosenParticipant;
}
