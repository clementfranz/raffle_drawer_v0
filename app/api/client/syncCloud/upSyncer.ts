import api from "../axios"; // adjust the path as needed
import { getOldestSyncQueueItem } from "~/hooks/indexedDB/syncCloud/getOldestSyncQueueItem";
import { getSyncQueueItemById } from "~/hooks/indexedDB/syncCloud/getSyncQueueItemById";
import { updateSyncQueueItemById } from "~/hooks/indexedDB/syncCloud/updateSyncQueueItemById";

export async function upSyncer(id?: number): Promise<boolean> {
  let item;

  if (!id) {
    item = await getOldestSyncQueueItem();
    if (!item) {
      console.log("🔍 No pending sync items.");
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

    item.payload = null;

    const responseBody = response.data;
    console.log("RESPONSE FROM SERVER: ", responseBody);

    if (response.status >= 200 && response.status < 300) {
      await updateSyncQueueItemById(item.id, {
        status: "completed",
        response_body: responseBody,
        payload: null,
        error_message: null
      });
    } else {
      await updateSyncQueueItemById(item.id, {
        status: "failed",
        response_body: responseBody,
        error_message: null
      });
    }

    if (response.status >= 200 && response.status < 300) {
      console.log(`✅ Sync completed for ID: ${item.id}`);
      return true;
    } else {
      return false;
    }
  } catch (err: any) {
    console.error("❌ Sync error:", err);

    await updateSyncQueueItemById(item.id, {
      status: "failed",
      error_message:
        err?.response?.data?.error || err.message || "Unknown error"
    });
    return false;
  }
}
