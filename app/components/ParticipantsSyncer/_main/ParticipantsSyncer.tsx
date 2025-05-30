import React, { use, useEffect, useRef, useState } from "react";
import useLocalStorageState from "use-local-storage-state";
import api from "~/api/asClient/axios";
import type { LocalParticipantsSyncStatus } from "~/api/types/localStorageStates/localParticipantsSyncStatus.types";

const CHECK_INTERVAL_MS = 5000;

const ParticipantsSyncer = () => {
  const [modalized, setModalized] = useLocalStorageState(
    "mismatchWarningModalized",
    { defaultValue: false }
  );
  const [triggerMismatchWarning, setTriggerMismatchWarning] =
    useLocalStorageState("triggerMismatchWarning", { defaultValue: false });
  const [revealWarningUI, setRevealWarningUI] = useLocalStorageState(
    "revealWarningUI",
    { defaultValue: false }
  );
  const [totalMismatch, setTotalMismatch] = useLocalStorageState(
    "localTotalMismatchCount",
    { defaultValue: 0 }
  );
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const isFetching = useRef(false);

  const localStatusRef = useRef<LocalParticipantsSyncStatus>("none");
  const localSyncingClearedRef = useRef<boolean>(false);
  const localTotalRef = useRef<number>(0);

  const debugMode = true;

  const dlog = (...args: unknown[]) => {
    if (debugMode) {
      console.log("Tracing Code ⭐⭐: ", ...args);
    }
  };

  const [localTotal] = useLocalStorageState("localTotalParticipants", {
    defaultValue: 0
  });

  const [localParticipantsSyncingStatus, setLocalParticipantsSyncingStatus] =
    useLocalStorageState<LocalParticipantsSyncStatus>(
      "localParticipantsSyncingStatus",
      { defaultValue: "none" }
    );

  const [localParticipantsSyncingCleared, setLocalParticipantsSyncingCleared] =
    useLocalStorageState<boolean>("localParticipantsSyncingCleared", {
      defaultValue: false
    });

  const [savedCloudTotal, setSavedCloudTotal] = useLocalStorageState(
    "savedLocalCloudTotalParticipants",
    { defaultValue: 0 }
  );

  const handleAcknowledge = () => {
    setModalized(false);
  };

  const checkMismatch = async () => {
    dlog("starting actual loop");

    const currentStatus = localStatusRef.current;
    dlog("LOCAL STATUS (pre-fetch): ", currentStatus);

    if (currentStatus !== "stable") {
      dlog("⚠️ Skipping fetch: status is not stable.");
      return;
    }

    if (isFetching.current) {
      dlog("⏳ Already fetching, skip this loop.");
      return;
    }

    isFetching.current = true;

    try {
      dlog("🌐 Fetching participant count...");
      const response = await api.get("/participants/count");
      const cloudTotal = response.data.total;

      const mismatch = Math.abs(cloudTotal - localTotalRef.current);

      // ✅ Double-check the status again
      if (localStatusRef.current !== "stable") {
        dlog("LOCAL STATUS (post-fetch): ", currentStatus);
        dlog("⛔ Status changed during fetch. Skipping mismatch handling.");
        return;
      }

      if (!localSyncingClearedRef.current) {
        dlog("LOCAL STATUS (syncing not cleared yet): ", currentStatus);
        dlog("Cancelling mismatch check. Still syncing. ");
        return;
      }

      if (mismatch > 0) {
        setTotalMismatch(mismatch);
        setTriggerMismatchWarning(true);
        dlog("🚨 Mismatch detected:", mismatch);

        const revealTimeout = setTimeout(() => {
          setRevealWarningUI(true);
          clearTimeout(revealTimeout);
        }, 1000);
      } else {
        dlog("No mismatch detected. Clear for now");
      }
    } catch (error) {
      console.error("❌ Failed to fetch participants:", error);
    } finally {
      isFetching.current = false;
    }
  };

  const getLocalStatus = () => {
    const status = localParticipantsSyncingStatus;
    return status;
  };

  useEffect(() => {
    localStatusRef.current = localParticipantsSyncingStatus;
    if (localParticipantsSyncingStatus === "none") {
      setTriggerMismatchWarning(false);
      setModalized(true);
      setRevealWarningUI(false);
      setTotalMismatch(0);
    }
  }, [localParticipantsSyncingStatus]);

  useEffect(() => {
    localSyncingClearedRef.current = localParticipantsSyncingCleared;
  }, [localParticipantsSyncingCleared]);

  useEffect(() => {
    localTotalRef.current = localTotal;
  }, [localTotal]);

  const startLoopCheckMismatch = () => {
    dlog("🔁 Attempting to start mismatch check loop...");

    if (intervalRef.current !== null) {
      dlog("⏱ Loop already running, skipping re-initialization.");
      return;
    }

    intervalRef.current = setInterval(() => {
      dlog("inside loop now");
      checkMismatch(); // ✅ always fresh!
    }, CHECK_INTERVAL_MS);

    dlog("✅ Mismatch check loop started.");
  };

  useEffect(() => {
    startLoopCheckMismatch();
    return () => {
      dlog("🧹 Cleaning up interval");
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null; // ✅ Reset to allow restart
      }
    };
  }, []);

  return (
    <>
      {triggerMismatchWarning ? (
        <div
          className={`overflow-hidden absolute bottom-0 z-[50] transition-all duration-1000 ${
            modalized ? "w-screen h-screen" : "w-[480px] h-[300px] m-4"
          }`}
        >
          <div
            className={`absolute bottom-0 left-0 z-[50] overflow-hidden transition-all duration-1000  justify-center items-center select-none flex ${
              revealWarningUI ? "translate-x-0" : "translate-x-full"
            } ${
              modalized
                ? "w-screen h-screen  rounded-none bg-red-800/70"
                : "w-[480px] h-[300px] rounded-2xl bg-transparent"
            }`}
          >
            <div className="wrapper relative w-[480px] h-[300px] rounded-2xl overflow-hidden transition-all duration-1000">
              <div className="pulsing-background bg-red-900 absolute inset-0 z-0" />
              <div className="content relative z-50 text-white p-5 flex flex-col gap-4 h-full">
                <div className="header font-semibold text-center flex w-full items-center justify-center gap-5">
                  <div className="animate-ping">⚠️</div>
                  <div>Mismatch Detected!</div>
                  <div className="animate-ping">⚠️</div>
                </div>

                <div className="content-body text-sm indent-[15px] text-justify flex flex-col gap-1.5">
                  <p>
                    There are multiple entries of participants not in sync with
                    the database.{" "}
                    <b>
                      Total number is{" "}
                      <span className="underline text-yellow-400">
                        {totalMismatch.toLocaleString()} mismatches
                      </span>
                    </b>
                  </p>
                  <p>
                    It is recommended that you re-sync all participants to avoid
                    data inconsistencies, potential display errors, or missing
                    records.
                  </p>
                  {!modalized && (
                    <>
                      <p className="font-stretch-semi-expanded font-semibold">
                        First, clear the participants <b>within the app</b>{" "}
                        using the "Overview" tab in the Control Panel. After
                        that, re-download them from the cloud.
                      </p>
                      <p>
                        This modal will remain visible until re-syncing is
                        complete. Thank you!
                      </p>
                    </>
                  )}
                </div>

                {modalized && (
                  <div className="button flex justify-end items-end grow w-full">
                    <button
                      onClick={handleAcknowledge}
                      className="bg-gray-700 hover:bg-gray-800 text-white text-sm px-5 py-3 rounded-2xl cursor-pointer"
                    >
                      Thanks for the info
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="hidden">No Mismatch Detected</div>
      )}
    </>
  );
};

export default ParticipantsSyncer;
