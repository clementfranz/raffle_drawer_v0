import React, { useEffect, useRef, useState } from "react";
import useLocalStorageState from "use-local-storage-state";
import api from "~/api/client/axios";

const CloudSyncer: React.FC = () => {
  const [isServerActive, setIsServerActive] = useLocalStorageState<boolean>(
    "isServerActive",
    {
      defaultValue: false
    }
  );

  const failureCount = useRef(0);
  const timerId = useRef<NodeJS.Timeout | null>(null);

  const checkServer = async () => {
    try {
      const response = await api.get("/ping");

      if (response.status === 200) {
        if (!isServerActive) {
          console.log("✅ Server is back online.");
        }
        setIsServerActive(true);
        failureCount.current = 0;

        // Recheck soon again (back to 5s if we were in long wait)
        startPolling(5000);
      } else {
        handleFailure();
      }
    } catch {
      handleFailure();
    }
  };

  const handleFailure = () => {
    setIsServerActive(false);
    failureCount.current += 1;

    const retries = failureCount.current;
    console.log(`🚫 Server offline. Attempt #${retries}`);

    if (retries === 10) {
      console.log("🕒 Switching to 1-minute retry...");
      startPolling(60000); // 1 minute
    }
  };

  const startPolling = (delay: number) => {
    if (timerId.current) clearInterval(timerId.current);
    timerId.current = setInterval(checkServer, delay);
  };

  useEffect(() => {
    startPolling(5000); // Initial poll every 5s

    return () => {
      if (timerId.current) clearInterval(timerId.current);
    };
  }, []);

  return null; // 🔒 Hidden
};

export default CloudSyncer;
