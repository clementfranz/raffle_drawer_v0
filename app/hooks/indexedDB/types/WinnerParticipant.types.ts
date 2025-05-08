export interface WinnerParticipant {
  id_entry: string;
  participant_batch_id: string;
  full_name: string;
  winner_status: boolean;
  raffle_code: string;
  winner_type: "primary" | "backup";
}
