import { getOldestSyncQueueItem } from "~/hooks/indexedDB/syncCloud/getOldestSyncQueueItem";

export async function upSyncer() {
  const item = await getOldestSyncQueueItem();

  if (!item) {
    console.log("🔍 No pending sync items.");
    return;
  }

  try {
    console.log(`📤 Syncing to: ${item.api_url}...`);

    const response = await fetch(item.api_url, {
      method: item.method_type,
      headers: {
        "Content-Type": item.content_type || "application/json",
        ...item.headers
      },
      body:
        item.method_type === "GET" || item.method_type === "DELETE"
          ? undefined
          : JSON.stringify(item.payload)
    });

    const responseBody = await response.json();

    const tx = db.transaction("syncCloud", "readwrite");
    const store = tx.objectStore("syncCloud");

    const updatedItem = {
      ...item,
      status: response.ok ? "completed" : "failed",
      response_body: responseBody,
      error_message: response.ok
        ? null
        : responseBody?.error || "Unknown error",
      updatedAt: new Date().toISOString()
    };

    await store.put(updatedItem);
    await tx.done;

    console.log(
      `✅ Sync ${response.ok ? "completed" : "failed"} for ID: ${item.id}`
    );
  } catch (err: any) {
    console.error("❌ Sync error:", err);

    const tx = db.transaction("syncCloud", "readwrite");
    const store = tx.objectStore("syncCloud");

    const failedItem = {
      ...item,
      status: "failed",
      error_message: err.message,
      updatedAt: new Date().toISOString()
    };

    await store.put(failedItem);
    await tx.done;
  }
}
