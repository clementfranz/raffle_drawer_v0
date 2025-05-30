import React, { useCallback, useEffect, useRef, useState } from "react";
import useLocalStorageState from "use-local-storage-state";
import api from "~/api/asClient/axios";
import TableWrapper from "../components/TableWrapper";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose } from "@fortawesome/free-solid-svg-icons";
import { downSyncWinnerParticipant } from "~/hooks/indexedDB/syncCloud/downSyncs/downSyncWinnerParticipant";
import { getWinnerParticipantsRaffleCodes } from "~/api/asClient/winnerParticipants/getWinnerParticipantsRaffleCodes";
import { getAllWinnerParticipantsRaffleCodes } from "~/hooks/indexedDB/winnerParticipant/getAllWinnerParticipantsRaffleCodes";
import { getQueuedDownSyncRaffleCodes } from "~/hooks/indexedDB/syncCloud/queuedSyncs/getQueuedDownSyncRaffleCodes";
import { downSyncWinnerParticipantRemoval } from "~/hooks/indexedDB/syncCloud/downSyncs/downSyncWinnerParticipantRemoval";
import { useLocation } from "react-router";
import { getQueuedRemovalSyncRaffleCodes } from "~/hooks/indexedDB/syncCloud/queuedSyncs/getQueuedRemovalSyncRaffleCodes";
import { getAllPendingParticipantsSync } from "~/hooks/indexedDB/syncCloud/getAllPendingParticipantsSync";
import type { LocalParticipantsSyncStatus } from "~/api/types/localStorageStates/localParticipantsSyncStatus.types";

const debugMode = true;

const dlog = (...args: unknown[]) => {
  if (debugMode) {
    console.log("Tracing Code ☕☕: ", ...args);
  }
};

const CloudSyncer: React.FC = () => {
  const [isServerActive, setIsServerActive] = useLocalStorageState<boolean>(
    "isServerActive",
    { defaultValue: true }
  );

  const [hasSyncQueueList, setHasSyncQueueList] = useLocalStorageState<boolean>(
    "hasSyncQueueList",
    { defaultValue: true }
  );

  const [localParticipantsRaffleCodes, setLocalParticipantsRaffleCodes] =
    useLocalStorageState<string[]>("localParticipantsRaffleCodes", {
      defaultValue: []
    });
  const [localRemovedWinnersRaffleCodes, setLocalRemovedWinnersRaffleCodes] =
    useLocalStorageState<string[]>("localRemovedWinnersRaffleCodes", {
      defaultValue: []
    });

  const [withParticipantsData, setWithParticipantsData] = useLocalStorageState(
    "withParticipantsData"
  );

  const withParticipantsDataRef = useRef<boolean>(false);

  const [localParticipantsSyncingCleared, setLocalParticipantsSyncingCleared] =
    useLocalStorageState<boolean>("localParticipantsSyncingCleared", {
      defaultValue: false
    });

  const [localParticipantsSyncingStatus, setLocalParticipantsSyncingStatus] =
    useLocalStorageState<LocalParticipantsSyncStatus>(
      "localParticipantsSyncingStatus",
      { defaultValue: "none" }
    );

  const localSyncingClearedRef = useRef<boolean>(false);
  const startCheckingSyncStatus = useRef<boolean>(false);

  const [cloudSyncModalOpen, setCloudSyncModalOpen] =
    useLocalStorageState<boolean>("cloudSyncModalOpen", {
      defaultValue: false
    });

  const [refreshTable] = useLocalStorageState("refreshTable");

  const [syncWindowOpen, setSyncWindowOpen] = useState(false);

  const isServerActiveRef = useRef<boolean>(isServerActive);
  const failureCount = useRef(0);
  const stopPingLoop = useRef(false);

  const location = useLocation();

  // Keep refs in sync with state
  useEffect(() => {
    isServerActiveRef.current = isServerActive;
    if (withParticipantsData) {
      withParticipantsDataRef.current = true;
    } else {
      withParticipantsDataRef.current = false;
    }
  }, [isServerActive, withParticipantsData]);

  useEffect(() => {
    syncWinners();
  }, [refreshTable, location.search]);

  const getStableLocalRaffleCodes = async () => {
    const idbWinnersRaffloCodes = await getAllWinnerParticipantsRaffleCodes();
    const initialCodeList = [...idbWinnersRaffloCodes];
    return Array.from(new Set(initialCodeList));
  };

  async function getAllInOneDataSet() {
    const [localCodes, localQueuedCodesToRemove, localQueuedCodesToDownload] =
      await Promise.all([
        getStableLocalRaffleCodes(),
        getQueuedRemovalSyncRaffleCodes(),
        getQueuedDownSyncRaffleCodes()
      ]);

    return {
      localCodes,
      localQueuedCodesToRemove,
      localQueuedCodesToDownload
    };
  }

  const syncWinners = async () => {
    try {
      const cloudRaffleCodes = await getWinnerParticipantsRaffleCodes();
      const {
        localCodes,
        localQueuedCodesToRemove,
        localQueuedCodesToDownload
      } = await getAllInOneDataSet();

      const localSet = new Set(localCodes);
      const cloudSet = new Set(cloudRaffleCodes);
      const removalSet = new Set([
        ...localQueuedCodesToRemove,
        ...localRemovedWinnersRaffleCodes
      ]);
      const downloadSet = new Set(localQueuedCodesToDownload);

      const codesToPull = cloudRaffleCodes.filter(
        (code) =>
          !localSet.has(code) && !downloadSet.has(code) && !removalSet.has(code)
      );

      const codesToRemoveLocally = localCodes.filter(
        (code) => !cloudSet.has(code) && !removalSet.has(code)
      );

      console.log("🤖 Codes to pull from cloud:", codesToPull);
      console.log("🤖 Codes to remove locally:", codesToRemoveLocally);

      await Promise.all([
        ...codesToPull.map((code) => downSyncWinnerParticipant(code)),
        ...codesToRemoveLocally.map((code) =>
          downSyncWinnerParticipantRemoval(code)
        )
      ]);

      console.log("✅ Sync complete.");
    } catch (err) {
      console.error("❌ Sync failed:", err);
    }
  };

  const checkForParticipantsSyncingStatus = async () => {
    dlog("Checking participants sync status");
    startCheckingSyncStatus.current = true;
    try {
      const countPending = await getAllPendingParticipantsSync();
      if (countPending === 0 && withParticipantsDataRef.current) {
        dlog("✅✅✅ Syncing is now cleared");
        setLocalParticipantsSyncingCleared(true);
        setLocalParticipantsSyncingStatus("stable");
        localSyncingClearedRef.current = true;
      } else {
        dlog(
          "Syncing is NOT cleared. Trying again later... | Count Pending : ",
          countPending
        );
        dlog("With Participants? ", withParticipantsDataRef.current);
        localSyncingClearedRef.current = false;
        startCheckingSyncStatus.current = false;
      }
    } catch (error) {
      localSyncingClearedRef.current = false;
      startCheckingSyncStatus.current = false;
    }
  };

  const checkServer = async () => {
    dlog("ATTEMPT: Checking participants sync status");
    if (!localSyncingClearedRef.current && !startCheckingSyncStatus.current) {
      dlog("ATTEMPT PROCEED: Checking participants sync status");
      checkForParticipantsSyncingStatus();
    } else if (
      localSyncingClearedRef.current &&
      startCheckingSyncStatus.current
    ) {
      dlog("ATTEMPT CANCELLED: All Clear, no need to check");
    } else {
      dlog("ATTEMPT CANCELLED: Checking participants sync status");
      dlog("localSyncingClearedRef :", localSyncingClearedRef.current);
      dlog("startCheckingSyncStatus :", startCheckingSyncStatus.current);
    }

    try {
      const response = await api.get("/ping");

      if (response.status === 200) {
        console.log("✅ Server is back online.");
        setIsServerActive(true);
        failureCount.current = 0;
        return true;
      } else {
        console.log("🚫 Server response not 200.");
      }
    } catch (error) {
      console.error("❌ Error checking server:", error);
    }

    setIsServerActive(false);
    failureCount.current += 1;
    console.log(`🔌 Attempt #${failureCount.current} to reconnect...`);
    return false;
  };

  const loopPing = async () => {
    while (!stopPingLoop.current) {
      await checkServer();
      await new Promise((resolve) => setTimeout(resolve, 10 * 1000)); // Ping every 2s
    }
  };

  useEffect(() => {
    stopPingLoop.current = false;

    const startLoops = async () => {
      await Promise.all([loopPing()]);
    };

    startLoops();

    return () => {
      stopPingLoop.current = true;
    };
  }, []);

  return (
    <div
      className={`bg-[#33333393] z-[100] absolute top-0 left-0 w-screen h-screen justify-center items-center ${
        cloudSyncModalOpen ? "flex" : "hidden"
      }`}
    >
      <div className="modal bg-white h-[80%] aspect-[3/2] rounded-2xl drop-shadow-2xl drop-shadow-black flex flex-col gap-4 py-4">
        <div className="header px-4 flex justify-between">
          <h1 className="text-base font-bold">
            Cloud Syncronizations (Backgroud Process)
          </h1>
          <button
            aria-label="close-modal"
            className="bg-gray-700 text-white h-[30px] aspect-square rounded-full hover:bg-gray-500 cursor-pointer"
            onClick={() => {
              setCloudSyncModalOpen(false);
            }}
          >
            <FontAwesomeIcon icon={faClose} />
          </button>
        </div>
        <div className="body  grow px-4 text-sm h-0 overflow-y-scroll">
          <TableWrapper />
        </div>
        <div className="footer px-4 text-sm">
          {isServerActive ? (
            <>
              <span className="text-emerald-600 animate-pulse">
                Syncing everything to cloud...
              </span>
            </>
          ) : (
            <>
              <span className="text-red-600">
                Server is offline. Syncing is paused.
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CloudSyncer;
