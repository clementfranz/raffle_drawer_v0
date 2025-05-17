import { deleteStoreWithProgress } from "../_main/useIndexedDB";

export async function clearAllParticipants(updateProgress: any): Promise<any> {
  const result = await deleteStoreWithProgress(
    "participant",
    2000,
    updateProgress
  );

  return result;
}
