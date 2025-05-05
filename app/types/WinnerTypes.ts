export interface Winner {
  date_chosen: string;
  full_name: string;
  id: number;
  id_entry: string | number;
  isCancelled: boolean;
  raffle_code: string;
  regional_location: string;
  time_registered: string;
}

export interface WinnerRecords {
  primary: Winner | null;
  backups: [Winner | null, Winner | null, Winner | null];
}
