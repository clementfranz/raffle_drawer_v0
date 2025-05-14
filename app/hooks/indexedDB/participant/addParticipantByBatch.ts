import { create } from "../_main/useIndexedDB";

export async function addParticipantByBatch(
  dataArray: any[],
  batchId: string,
  updateProgress: (progress: number) => void
): Promise<any[]> {
  const batchSize = 1500; // Adjust the batch size based on performance testing
  const results: any[] = [];
  interface ParticipantData {
    id?: number;
    id_entry?: string;
    raffle_code?: string;
    is_archived?: boolean;
    regional_location?: string;
    participant_batch_id: number;
    is_drawn: boolean;
  }

  const normalizedDataArray = dataArray.map<ParticipantData>((data) => {
    return {
      is_archived: "false",
      participant_batch_id: 1,
      ...data,
      is_drawn: data.is_drawn === 0 || !data.is_drawn ? "false" : "true",
      id_entry: data.id_entry?.toString()
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
