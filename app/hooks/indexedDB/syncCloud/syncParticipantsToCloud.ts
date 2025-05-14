import { syncParticipantsToCloudPerBatch } from "./syncParticipantsToCloudPerBatch";

export async function syncParticipantsToCloud(
  dataArray: any[],
  batchId: string,
  apiURL: string,
  updateProgress: (progress: number) => void
): Promise<any[]> {
  const batchSize = 2500;
  const results: any[] = [];

  console.log("🔄 Starting sync to cloud...");
  console.log(`🧾 Total entries: ${dataArray.length}`);
  console.log(`📦 Batch size: ${batchSize}`);
  console.log(`🆔 Batch ID: ${batchId}`);
  console.log(`🌐 API URL: ${apiURL}`);

  for (let i = 0; i < dataArray.length; i += batchSize) {
    const currentBatch = dataArray.slice(i, i + batchSize);
    const currentBatchNumber = Math.floor(i / batchSize) + 1;

    console.log(`🚚 Processing batch ${currentBatchNumber}...`);
    console.log(`🔢 Entries in this batch: ${currentBatch.length}`);

    try {
      const batchResults = await syncParticipantsToCloudPerBatch(
        currentBatch,
        batchId,
        apiURL
      );
      results.push(...batchResults);

      const progress = parseFloat(
        (((i + batchSize) / dataArray.length) * 100).toFixed(2)
      );
      updateProgress(progress);

      console.log(`✅ Batch ${currentBatchNumber} added to queue.`);
      console.log(`📈 Progress: ${progress}%`);
    } catch (error) {
      console.error(`❌ Error syncing batch ${currentBatchNumber}:`, error);
    }
  }

  console.log("🎉 All batches processed and queued for sync.");
  return results;
}
