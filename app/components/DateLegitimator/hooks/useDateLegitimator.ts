import { useEffect, useState } from "react";
import { useLocalDaysOfUse } from "./useLocalDaysOfUse";
import useLocalStorageState from "use-local-storage-state";

/**
 * Runs a suite of date-legitimacy checks based on a provided “systemDate”.
 * Designed to be extensible—additional hooks or validations can be layered in easily.
 */
export function useDateLegitimator(systemDate: string) {
  const {
    daysUsed,
    today,
    isTodayNewlyAdded,
    error: localDaysError,
    illegitimateDate
  } = useLocalDaysOfUse(systemDate);

  const [error, setError] = useState<string | null>(null);
  const [localIllegitimateDate, setLocalIllegitimateDate] =
    useLocalStorageState("nrds_illegitimate_date", {
      defaultValue: false
    });

  useEffect(() => {
    // --- Check #0: Error from local days hook (e.g. backdated system date) ---
    if (localDaysError) {
      setError(localDaysError);
      return;
    }

    // --- Check #1: Integrity of local days list ---
    if (daysUsed.length > 0) {
      const latestLocal = daysUsed[daysUsed.length - 1];
      if (new Date(latestLocal) < new Date(systemDate)) {
        setError("illegitimateDate");
        return;
      }
    }

    // --- Future Check #2: Latest participant entry ---
    // const latestParticipantDate = getParticipantsDataLatestEntryDate();
    // if (new Date(latestParticipantDate) < new Date(systemDate)) {
    //   setError("participantsDateError");
    //   return;
    // }

    // --- Future Check #3: Latest winner entry ---
    // const latestWinnerDate = getWinnersDataLatestEntryDate();
    // if (new Date(latestWinnerDate) < new Date(systemDate)) {
    //   setError("winnersDateError");
    //   return;
    // }

    // All checks passed
    setError(null);
  }, [daysUsed, systemDate, localDaysError]);

  useEffect(() => {
    if (illegitimateDate) {
      setLocalIllegitimateDate(true);
    } else {
      setLocalIllegitimateDate(false);
    }
  }, [illegitimateDate]);

  return {
    daysUsed,
    today,
    isTodayNewlyAdded,
    error,
    illegitimateDate
  };
}
