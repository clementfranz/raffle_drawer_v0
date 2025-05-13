export interface SyncCloud {
  id?: number; // Auto-increment, optional when creating
  action: string; // e.g., 'createParticipant'
  instructions?: Record<string, any>; // Optional task options
  payload: {
    participant_batch_id: string;
    full_name: string;
    winner_status: boolean;
    raffle_code: string;
    winner_type: "primary" | "backup";
  };
  status: "pending" | "synced" | "failed";
  createdAt: string; // ISO date string
  syncedAt?: string | null; // ISO date string or null
  retryCount?: number;
  errorMessage?: string | null;
}
