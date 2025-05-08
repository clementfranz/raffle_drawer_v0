import { create } from "../_main/useIndexedDB";

export async function addParticipant(data: any): Promise<any> {
  const result = await create("participant", data);

  return result;
}
