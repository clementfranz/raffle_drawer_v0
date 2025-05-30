// hooks/useRemoveWinnerParticipant.ts
import { useCallback } from "react";
import useLocalStorageState from "use-local-storage-state";
import { initDB } from "../_main/useIndexedDB";
import { upSyncRemoveWinnerParticipant } from "../syncCloud/upSyncs/upSyncRemoveWinnerParticipant";

export function useRemoveWinnerParticipant() {
  const [localRemovedWinnersRaffleCodes, setLocalRemovedWinnersRaffleCodes] =
    useLocalStorageState<string[]>("localRemovedWinnersRaffleCodes", {
      defaultValue: []
    });

  const removeWinnerParticipant = useCallback(
    async (id_entry: string, raffle_code: string): Promise<boolean> => {
      const db = await initDB();

      try {
        const tx = db.transaction("winnerParticipant", "readwrite");
        const store = tx.objectStore("winnerParticipant");

        const key = await store.index("id_entry").getKey(id_entry);
        if (!key) {
          console.warn(
            `No winner participant found with id_entry: ${id_entry}`
          );
          return false;
        }

        const participant = await store.get(key);
        if (!participant || participant.raffle_code !== raffle_code) {
          console.warn(`Raffle code mismatch or participant not found.`);
          return false;
        }

        await store.delete(key);
        await tx.done;

        const newArray = [
          ...localRemovedWinnersRaffleCodes,
          participant.raffle_code
        ];
        setLocalRemovedWinnersRaffleCodes(newArray);

        await upSyncRemoveWinnerParticipant(participant.raffle_code);

        return true;
      } catch (error) {
        console.error("Error removing winner participant:", error);
        return false;
      }
    },
    [localRemovedWinnersRaffleCodes, setLocalRemovedWinnersRaffleCodes]
  );

  return {
    removeWinnerParticipant,
    localRemovedWinnersRaffleCodes
  };
}
