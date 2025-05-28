import { useEffect, useState, useMemo } from "react";
import useLocalStorageState from "use-local-storage-state";

/** Formats a Date object or string to "YYYY-MM-DD" */
const formatToYMD = (date: Date | string): string =>
  new Date(date).toISOString().split("T")[0];

type LocalDaysOfUseResult = {
  daysUsed: string[];
  today: string;
  isTodayNewlyAdded: boolean;
  error: string | null;
  illegitimateDate: boolean;
  warning: boolean;
  warningMessage: string | null;
};

/**
 * Hook: Tracks unique usage days in localStorage.
 *
 * - Stores dates as "YYYY-MM-DD" in 'nrds_days_of_use'
 * - Adds today to the list if it doesn't exist
 * - Detects if the system date is illegitimate (older than the latest)
 * - Prevents adding date if past the expiration date
 * - Prevents mutation if localStorage state is null or invalid
 * - Emits a separate warning state
 */
export function useLocalDaysOfUse(systemDate: string): LocalDaysOfUseResult {
  const [daysUsed, setDaysUsed] = useLocalStorageState<string[] | null>(
    "nrds_days_of_use",
    { defaultValue: [] }
  );

  const [isTodayNewlyAdded, setIsTodayNewlyAdded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [illegitimateDate, setIllegitimateDate] = useState(false);
  const [warning, setWarning] = useState(false);
  const [warningMessage, setWarningMessage] = useState<string | null>(null);

  const today = useMemo(() => formatToYMD(systemDate), [systemDate]);
  const expirationDay = formatToYMD(new Date("2026-05-30"));

  useEffect(() => {
    if (!Array.isArray(daysUsed)) {
      setWarning(true);
      setWarningMessage("Warning: localStorage is inaccessible or corrupted.");
      setError(null);
      setIllegitimateDate(false);
      setIsTodayNewlyAdded(false);
      return;
    }

    setWarning(false);
    setWarningMessage(null);

    const sortedDays = [...daysUsed].sort();
    const latestDay = sortedDays[sortedDays.length - 1] ?? null;

    if (latestDay && today < latestDay) {
      setError(`illegitimateDate: ${today} is older than ${latestDay}`);
      setIllegitimateDate(true);
      setIsTodayNewlyAdded(false);
      return;
    }

    if (today >= expirationDay) {
      setError(`expired: ${today} is beyond expiration date ${expirationDay}`);
      setIllegitimateDate(false);
      setIsTodayNewlyAdded(false);
      return;
    }

    setIllegitimateDate(false);

    if (daysUsed.includes(today)) {
      setError(null);
      setIsTodayNewlyAdded(false);
      return;
    }

    const updated = [...daysUsed, today].sort();
    setDaysUsed(updated);
    setIsTodayNewlyAdded(true);
    setError(null);
  }, [today, daysUsed, setDaysUsed]);

  return {
    daysUsed: Array.isArray(daysUsed) ? daysUsed : [],
    today,
    isTodayNewlyAdded,
    error,
    illegitimateDate,
    warning,
    warningMessage
  };
}
