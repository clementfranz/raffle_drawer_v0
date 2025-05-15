import React, { useEffect, useRef, useState } from "react";
import useLocalStorageState from "use-local-storage-state";
import api from "~/api/client/axios";
import TableWrapper from "./components/TableWrapper";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose } from "@fortawesome/free-solid-svg-icons";

const CloudSyncer: React.FC = () => {
  const [isServerActive, setIsServerActive] = useLocalStorageState<boolean>(
    "isServerActive",
    { defaultValue: true }
  );

  const [hasSyncQueueList, setHasSyncQueueList] = useLocalStorageState<boolean>(
    "hasSyncQueueList",
    { defaultValue: true }
  );

  const [cloudSyncModalOpen, setCloudSyncModalOpen] =
    useLocalStorageState<boolean>("cloudSyncModalOpen", {
      defaultValue: false
    });

  const [syncWindowOpen, setSyncWindowOpen] = useState(false);

  const isServerActiveRef = useRef<boolean>(isServerActive);
  const failureCount = useRef(0);
  const stopPingLoop = useRef(false);

  // Keep refs in sync with state
  useEffect(() => {
    isServerActiveRef.current = isServerActive;
  }, [isServerActive]);

  const checkServer = async () => {
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
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Ping every 2s
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
          Syncing everything to cloud...
        </div>
      </div>
    </div>
  );
};

export default CloudSyncer;
