import type { WinnerRecords, Winner } from "~/types/WinnerTypes";
import useLocalStorageState from "use-local-storage-state";

const defaultWinnerRecords: WinnerRecords = {
  primary: null,
  backups: [null, null, null]
};

export const useWinnerRecords = () => {
  const [winnerRecords, setWinnerRecords] = useLocalStorageState<WinnerRecords>(
    "winnerRecords",
    { defaultValue: defaultWinnerRecords }
  );

  // ✅ Set primary winner
  const setWinner = (winner: Winner | null) => {
    setWinnerRecords((prev) => ({
      ...prev!,
      primary: winner
    }));
  };

  // ✅ Set backup winner by index (0, 1, 2)
  const setBackupWinner = (index: 0 | 1 | 2, winner: Winner | null) => {
    setWinnerRecords((prev) => {
      if (!prev) return defaultWinnerRecords;

      const newBackups = [...prev.backups] as WinnerRecords["backups"];
      newBackups[index] = winner;

      return {
        ...prev,
        backups: newBackups
      };
    });
  };

  // ✅ Reset everything (primary + backups to null)
  const resetWinners = () => {
    setWinnerRecords(defaultWinnerRecords);
  };

  // ✅ Get filled winners status (true if filled, false if null)
  const getFilledWinners = () => ({
    primary: !!winnerRecords.primary,
    backups: winnerRecords.backups.map((backup) => !!backup)
  });

  // ✅ Clear a backup by index (set it to null)
  const clearBackup = (index: 0 | 1 | 2) => {
    setWinnerRecords((prev) => {
      if (!prev) return defaultWinnerRecords;

      const newBackups = [...prev.backups] as WinnerRecords["backups"];
      newBackups[index] = null;

      return {
        ...prev,
        backups: newBackups
      };
    });
  };

  // ✅ Get winner by index (0 for primary, 1-3 for backups)
  const getWinnerByIndex = (index: 0 | 1 | 2 | 3): Winner | null => {
    if (index === 0) return winnerRecords.primary;
    return winnerRecords.backups[index - 1] || null;
  };

  return {
    winnerRecords,
    setWinnerRecords,
    setWinner,
    setBackupWinner,
    resetWinners,
    getFilledWinners,
    clearBackup, // 🆕
    getWinnerByIndex // 🆕
  };
};
