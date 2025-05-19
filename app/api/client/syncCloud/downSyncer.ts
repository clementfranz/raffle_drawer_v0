import api from "../axios"; // adjust if needed
import { getOldestSyncQueueItem } from "~/hooks/indexedDB/syncCloud/getOldestSyncQueueItem";
import { getSyncQueueItemById } from "~/hooks/indexedDB/syncCloud/getSyncQueueItemById";
import { updateSyncQueueItemById } from "~/hooks/indexedDB/syncCloud/updateSyncQueueItemById";

export async function downSyncer(
  id: number | undefined,
  responseDataHandlingFunction: (data: any) => Promise<any> | void
): Promise<boolean> {
  let item;

  if (!id) {
    item = await getOldestSyncQueueItem();
    if (!item) {
      console.log("🔍 No pending down-sync items.");
      return false;
    }
  } else {
    item = await getSyncQueueItemById(id);
    if (!item) {
      console.log(`🔍 Sync Queue Item #${id} not found`);
      return false;
    }
  }

  try {
    console.log(`📥 Pulling from: ${item.api_url}...`);

    const method = item.method_type.toLowerCase(); // usually "get"
    const config = {
      headers: {
        "Content-Type": item.content_type || "application/json",
        ...item.headers
      }
    };

    const response = await api.request({
      url: item.api_url,
      method: method,
      ...config
    });

    const responseBody = response.data;
    console.log("RESPONSE FROM SERVER:", responseBody);

    if (response.status >= 200 && response.status < 300) {
      // ✅ Process response data before marking as complete
      await responseDataHandlingFunction(responseBody);

      await updateSyncQueueItemById(item.id, {
        status: "completed",
        response_body: responseBody,
        error_message: null
      });

      console.log(`✅ Down-sync completed for ID: ${item.id}`);
      return true;
    } else {
      await updateSyncQueueItemById(item.id, {
        status: "failed",
        response_body: responseBody,
        error_message: null
      });
      return false;
    }
  } catch (err: any) {
    console.error("❌ Down-sync error:", err);

    await updateSyncQueueItemById(item.id, {
      status: "failed",
      error_message:
        err?.response?.data?.error || err.message || "Unknown error"
    });
    return false;
  }
}
