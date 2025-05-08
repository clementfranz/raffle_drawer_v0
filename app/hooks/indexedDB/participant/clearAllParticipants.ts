import { deleteAllItems } from "../_main/useIndexedDB";

export async function clearAllParticipants(): Promise<any> {
  const result = await deleteAllItems("participant");

  return result;
}
