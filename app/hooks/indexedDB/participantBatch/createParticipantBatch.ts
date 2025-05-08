import { create } from "../_main/useIndexedDB";

export async function createParticipantBatch(data: any): Promise<any> {
  const result = await create("participantsBatch", data);

  return result;
}
