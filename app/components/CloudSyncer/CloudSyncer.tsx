import React, { useEffect, useRef } from "react";
import useLocalStorageState from "use-local-storage-state";
import api from "~/api/client/axios";
import { upSyncer } from "~/api/client/syncCloud/upSyncer";
import { getOldestSyncQueueItem } from "~/hooks/indexedDB/syncCloud/getOldestSyncQueueItem";

const CloudSyncer: React.FC = () => {
  const [isServerActive, setIsServerActive] = useLocalStorageState<boolean>(
    "isServerActive",
    { defaultValue: true }
  );
  const [hasSyncQueueList, setHasSyncQueueList] = useLocalStorageState<boolean>(
    "hasSyncQueueList",
    { defaultValue: true }
  );

  const isServerActiveRef = useRef<boolean>(isServerActive);
  const hasSyncQueueListRef = useRef<boolean>(hasSyncQueueList);
  const failureCount = useRef(0);
  const isSyncingRef = useRef(false);
  const stopPingLoop = useRef(false);
  const stopSyncLoop = useRef(false);

  // Keep refs in sync with state
  useEffect(() => {
    isServerActiveRef.current = isServerActive;
  }, [isServerActive]);

  useEffect(() => {
    hasSyncQueueListRef.current = hasSyncQueueList;
  }, [hasSyncQueueList]);

  const checkServer = async () => {
    try {
      const response = await api.get("/ping");

      if (response.status === 200) {
        console.log("✅ Server is back online.");
        setIsServerActive(true);
        failureCount.current = 0;
        await checkQueue();
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

  const checkQueue = async () => {
    try {
      const item = await getOldestSyncQueueItem();
      setHasSyncQueueList(!!item);
    } catch (error) {
      console.error("❌ Error checking sync queue:", error);
      setHasSyncQueueList(false);
    }
  };

  const trySync = async () => {
    if (isSyncingRef.current) {
      console.log("🔄 A sync is already in progress. Skipping...");
      return;
    }

    isSyncingRef.current = true;
    try {
      await upSyncer();
      console.log("✅ Sync completed.");
    } catch (error) {
      console.error("❌ Sync failed:", error);
    } finally {
      isSyncingRef.current = false;
    }
  };

  const loopPing = async () => {
    while (!stopPingLoop.current) {
      await checkServer();
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Ping every 2s
    }
  };

  const loopSync = async () => {
    console.log("🔁 Starting sync loop");
    while (!stopSyncLoop.current) {
      if (isServerActiveRef.current && hasSyncQueueListRef.current) {
        await trySync();
      }
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Sync every 1s
    }
  };

  useEffect(() => {
    stopPingLoop.current = false;
    stopSyncLoop.current = false;

    const startLoops = async () => {
      await Promise.all([loopPing(), loopSync()]);
    };

    startLoops();

    return () => {
      stopPingLoop.current = true;
      stopSyncLoop.current = true;
    };
  }, []);

  return null;
};

export default CloudSyncer;
