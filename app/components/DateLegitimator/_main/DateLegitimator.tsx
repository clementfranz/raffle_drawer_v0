import React, { useEffect, useState } from "react";
import { useDateLegitimator } from "../hooks/useDateLegitimator";
import "./DateLegitimator.css";
import useLocalStorageState from "use-local-storage-state";

const DateLegitimator = () => {
  const systemDate = new Date().toISOString().split("T")[0];

  const showStatus = false; // Set to false to hide status messages

  const [tick, setTick] = useState(0);

  const [localIllegitimateDate] = useLocalStorageState(
    "nrds_illegitimate_date",
    {
      defaultValue: false
    }
  );

  // This will rerun your hook every 4 mins via rerender
  const { daysUsed, today, isTodayNewlyAdded, error, illegitimateDate } =
    useDateLegitimator(systemDate);

  // Run every 4 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      if (!illegitimateDate) {
        setTick((prev) => prev + 1); // Trigger rerender
      }
    }, 4 * 60 * 1000); // 4 minutes in ms

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  return (
    <>
      {localIllegitimateDate ? (
        <div className="date-legitimator absolute top-0 left-0 w-full h-full flex flex-col items-center justify-end bg-[#00000080] p-4 pb-[50px] z-[70]">
          <div className="w-1/2 flex flex-col items-center justify-center bg-[#3f0909c4] text-white gap-4 p-6 rounded-3xl shadow-lg ">
            <h1 className="text-2xl font-bold text-red-300">
              SYSTEM DATE ANOMALY DETECTED
            </h1>
            <p>
              Please ensure that your system date and time are correctly set to
              the actual current date. This is important because the application
              checks for the latest dependencies and updates during runtime.
              Incorrect system time may result in failed requests, outdated
              configurations, or unexpected behavior, as the system relies on
              accurate time data to verify compatibility and version validity.
            </p>

            {showStatus && (
              <div className="w-full bg-[#181818] rounded p-4 text-sm leading-relaxed shadow-inner font-mono">
                <div>
                  <span className="text-green-500">$</span> Recorded days of
                  use: <span className="text-white">{daysUsed.join(", ")}</span>
                </div>
                {isTodayNewlyAdded && (
                  <div>
                    <span className="text-green-500">$</span>{" "}
                    <span className="text-green-300">
                      Today ({today}) was just added.
                    </span>
                  </div>
                )}
                {error === "illegitimateDate" && (
                  <div>
                    <span className="text-green-500">$</span>{" "}
                    <span className="text-yellow-400">[WARN]</span>{" "}
                    <span className="text-red-400">
                      Detected an illegitimate date!
                    </span>
                  </div>
                )}
                {error && error !== "illegitimateDate" && (
                  <div>
                    <span className="text-green-500">$</span>{" "}
                    <span className="text-yellow-400">[WARN]</span>{" "}
                    <span className="text-red-400">{error}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      ) : (
        <span className="hidden">Date Today: {systemDate} (Valid Date)</span>
      )}
    </>
  );
};

export default DateLegitimator;
