export interface Entry {
  id_entry: number; // Unique identifier for the entry
  full_name: string; // The full name of the person
  raffle_code: string; // The unique raffle code for the entry
  region: string; // Region where the person is located (e.g., Luzon, Visayas, Mindanao)
  registered_at: string; // The time the person registered (in ISO 8601 format)
}

export interface EntryBatch {
  batchNumber: number; // Indicates the batch number for easier tracking
  entries: Entry[]; // Array of Entry objects
}

export type Region =
  | "North Luzon"
  | "Central Luzon"
  | "Southern Luzon"
  | "Visayas"
  | "Mindanao"; // Predefined regions to use in filtering
