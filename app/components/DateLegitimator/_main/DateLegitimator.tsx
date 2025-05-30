import React, { useEffect, useState } from "react";
import { useDateLegitimator } from "../hooks/useDateLegitimator";
import "./DateLegitimator.css";
import useLocalStorageState from "use-local-storage-state";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRefresh, faSignOut } from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "~/auth/AuthContext";
import { useNavigate } from "react-router";
import { logUserAction } from "~/api/asClient/system/logUserAction";

const DateLegitimator = () => {
  const systemDate = new Date().toISOString().split("T")[0];

  const showStatus = false; // Set to false to hide status messages

  const [tick, setTick] = useState(0);

  const [isServerActive, setIsServerActive] = useLocalStorageState<boolean>(
    "isServerActive",
    { defaultValue: true }
  );

  const [dependencyWarningActive, setDependencyWarningActive] =
    useLocalStorageState<boolean>("dependencyWarningActive", {
      defaultValue: false
    });

  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/"); // Redirect to home or login page
    logUserAction(user?.email || "user@noemail.com", "logout", {
      source: "Logout",
      result: "success"
    });
  };

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
      {!isServerActive && !dependencyWarningActive && (
        <>
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-lime-300/50 to-yellow-100/50 ">
            <div className="bg-white/50 max-w-md w-full p-6 rounded-2xl shadow-xl text-center space-y-4 backdrop-blur-sm ">
              <h1 className="text-2xl font-bold text-lime-800">
                🚫 Server Offline
              </h1>
              <p className="text-gray-700">
                We kindly ask you to start the server to continue using the
                system without interruption.
                <br />
                <br />
                Thank you for your understanding!
              </p>

              {/* Stylish Refresh Button */}
              <div className=" flex justify-around">
                <button
                  onClick={() => window.location.reload()}
                  className="mt-4 cursor-pointer inline-flex items-center gap-2 px-5 py-2 bg-lime-600 text-white font-semibold rounded-full shadow-md hover:bg-lime-700 active:scale-95 transition-transform duration-150"
                >
                  <FontAwesomeIcon icon={faRefresh} />
                  Refresh
                </button>
                <button
                  onClick={handleLogout}
                  className="mt-4 cursor-pointer inline-flex items-center gap-2 px-5 py-2 bg-lime-800 text-white font-semibold rounded-full shadow-md hover:bg-lime-900 active:scale-95 transition-transform duration-150"
                >
                  <FontAwesomeIcon icon={faSignOut} />
                  Logout
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default DateLegitimator;
