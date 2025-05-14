export interface Winner {
  full_name: string;
  id: number;
  id_entry: string | number;
  raffle_code: string;
  regional_location: string;
  registered_at: string;
  full_name_raw: string;
}

export interface WinnerRecords {
  primary: Winner | null;
  backups: [Winner | null, Winner | null, Winner | null];
}
