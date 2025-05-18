import { create } from "../_main/useIndexedDB";

function pad(n: number): string {
  return n < 10 ? "0" + n : "" + n;
}

export async function addParticipantByBatch(
  dataArray: any[],
  batchId: string,
  updateProgress: (progress: number) => void
): Promise<any[]> {
  const batchSize = 2500;
  interface ParticipantData {
    id?: number;
    id_entry?: string;
    raffle_code?: string;
    is_archived?: boolean;
    regional_location?: string;
    participant_batch_id: number;
    is_drawn: boolean;
    registered_at: Date | string;
  }

  const sortedDataArray = dataArray.sort((a, b) => a.id_entry - b.id_entry);

  const normalizedDataArray = sortedDataArray.map<ParticipantData>((data) => {
    let registeredAtValue = data.registered_at;

    if (
      typeof registeredAtValue === "string" ||
      registeredAtValue instanceof Date
    ) {
      const date = new Date(registeredAtValue);

      if (!isNaN(date.getTime())) {
        registeredAtValue = formatDateToMySQL(date);
      } else {
        throw new Error("Invalid date format for registered_at");
      }
    }

    function formatDateToMySQL(date: Date): string {
      return (
        `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
          date.getDate()
        )} ` +
        `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(
          date.getSeconds()
        )}`
      );
    }

    return {
      is_archived: false,
      participant_batch_id: 1,
      ...data,
      is_drawn: data.is_drawn === 0 || !data.is_drawn ? "false" : "true",
      id_entry: data.id_entry?.toString(),
      registered_at: registeredAtValue
    };
  });

  for (let i = 0; i < normalizedDataArray.length; i += batchSize) {
    const batch = normalizedDataArray.slice(i, i + batchSize);
    const batchPromises = batch.map((data) => create("participant", data));

    try {
      await Promise.all(batchPromises);

      const progress = parseFloat(
        (((i + batchSize) / normalizedDataArray.length) * 100).toFixed(2)
      );
      updateProgress(progress);
    } catch (error) {
      console.error("Error adding participants in batch:", error);
    }
  }

  return normalizedDataArray;
}
