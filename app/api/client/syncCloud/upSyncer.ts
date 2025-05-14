import api from "../axios"; // adjust the path as needed
import { getOldestSyncQueueItem } from "~/hooks/indexedDB/syncCloud/getOldestSyncQueueItem";
import { updateSyncQueueItemById } from "~/hooks/indexedDB/syncCloud/updateSyncQueueItemById";

export async function upSyncer() {
  const item = await getOldestSyncQueueItem();
  if (!item) {
    console.log("🔍 No pending sync items.");
    return;
  }

  try {
    console.log(`📤 Syncing to: ${item.api_url}...`);

    const method = item.method_type.toLowerCase(); // e.g. "post"
    const config = {
      headers: {
        "Content-Type": item.content_type || "application/json",
        ...item.headers
      }
    };

    const response = await api.request({
      url: item.api_url,
      method: method,
      data:
        method === "get" || method === "delete"
          ? undefined
          : { payload: item.payload },
      ...config
    });

    const responseBody = response.data;
    console.log("RESPONSE FROM SERVER: ", responseBody);

    await updateSyncQueueItemById(item.id, {
      status:
        response.status >= 200 && response.status < 300
          ? "completed"
          : "failed",
      response_body: responseBody,
      error_message: null
    });

    console.log(`✅ Sync completed for ID: ${item.id}`);
  } catch (err: any) {
    console.error("❌ Sync error:", err);

    await updateSyncQueueItemById(item.id, {
      status: "failed",
      error_message:
        err?.response?.data?.error || err.message || "Unknown error"
    });
  }
}
