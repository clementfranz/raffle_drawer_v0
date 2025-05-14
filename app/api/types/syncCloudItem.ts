export interface SyncCloudItem {
  id: number;
  api_url: string;
  method_type: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  content_type?: string;
  headers?: Record<string, string>;
  payload?: any;
  status:
    | "pending"
    | "in-progress"
    | "completed"
    | "failed"
    | "retrying"
    | "cancelled";
  response_body?: any;
  error_message?: string | null;
  createdAt: string;
  updatedAt?: string;
}
