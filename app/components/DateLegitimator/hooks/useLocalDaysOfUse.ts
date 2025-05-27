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
};

/**
 * Hook: Tracks unique usage days in localStorage.
 *
 * - Stores dates as "YYYY-MM-DD" in 'nrds_days_of_use'
 * - Adds today to the list if it doesn't exist
 * - Detects if the system date is illegitimate (older than the latest)
 */
export function useLocalDaysOfUse(systemDate: string): LocalDaysOfUseResult {
  const [daysUsed, setDaysUsed] = useLocalStorageState<string[]>(
    "nrds_days_of_use",
    { defaultValue: [] }
  );

  const [isTodayNewlyAdded, setIsTodayNewlyAdded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [illegitimateDate, setIllegitimateDate] = useState(false);

  const today = useMemo(() => formatToYMD(systemDate), [systemDate]);

  useEffect(() => {
    if (!Array.isArray(daysUsed)) return;

    const sortedDays = [...daysUsed].sort(); // Chronological
    const latestDay = sortedDays[sortedDays.length - 1] ?? null;

    // Handle backdated system date
    if (latestDay && today < latestDay) {
      setError(`illegitimateDate: ${today} is older than ${latestDay}`);
      setIllegitimateDate(true);
      setIsTodayNewlyAdded(false);
      return;
    }

    setIllegitimateDate(false);

    // If today is already present
    if (daysUsed.includes(today)) {
      setError(null);
      setIsTodayNewlyAdded(false);
      return;
    }

    // Add today's date
    const updated = [...daysUsed, today].sort();
    setDaysUsed(updated);
    setIsTodayNewlyAdded(true);
    setError(null);
  }, [today, daysUsed, setDaysUsed]);

  return {
    daysUsed,
    today,
    isTodayNewlyAdded,
    error,
    illegitimateDate
  };
}
