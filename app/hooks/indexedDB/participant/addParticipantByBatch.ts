import { create } from "../_main/useIndexedDB";

export async function addParticipantByBatch(
  dataArray: any[],
  batchId: string,
  updateProgress: (progress: number) => void
): Promise<any[]> {
  const batchSize = 500; // Adjust the batch size based on performance testing
  const results: any[] = [];

  // Ensure default values for is_drawn and is_archived
  const normalizedDataArray = dataArray.map((data) => {
    return {
      ...data,
      participant_batch_id: batchId,
      is_drawn: data.is_drawn !== undefined ? data.is_drawn : false,
      is_archived: data.is_archived !== undefined ? data.is_archived : false
    };
  });

  for (let i = 0; i < normalizedDataArray.length; i += batchSize) {
    const batch = normalizedDataArray.slice(i, i + batchSize);
    const batchPromises = batch.map((data) => create("participant", data));

    try {
      const batchResults = await Promise.all(batchPromises);
      results.push(...batchResults);

      // Calculate and update progress
      const progress = parseFloat(
        (((i + batchSize) / normalizedDataArray.length) * 100).toFixed(2)
      );
      updateProgress(progress); // Update the progress state
    } catch (error) {
      console.error("Error adding participants in batch:", error);
    }
  }

  return results;
}
