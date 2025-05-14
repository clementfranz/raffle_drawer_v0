export interface SyncCloud {
  id?: number;
  api_url: string;
  source: string;
  destination: string;
  type: string;
  payload: any;
  method_type: string;

  status:
    | "pending"
    | "in-progress"
    | "completed"
    | "failed"
    | "retrying"
    | "cancelled";
  retry_count: number;
  error_message?: string | null;
  priority: "low" | "medium" | "high";
  reference_id?: string | null;
  content_type?: string | null;
  triggered_by?: string | null;
  is_test: boolean;
  next_retry_at?: string | Date | null;
  headers?: any;
  response_body?: any;
  duration?: number | null;

  createdAt: string | Date;
  updatedAt: string | Date;
}
