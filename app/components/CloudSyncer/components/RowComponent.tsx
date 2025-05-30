import {
  faCloudArrowDown,
  faCloudArrowUp
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useRef, useState } from "react";
import useLocalStorageState from "use-local-storage-state";
import { downSyncer } from "~/api/asClient/syncCloud/downSyncer";
import { upSyncer } from "~/api/asClient/syncCloud/upSyncer";
import { getSyncQueueItemById } from "~/hooks/indexedDB/syncCloud/getSyncQueueItemById";
import { addWinnerParticipantFromCloud } from "~/hooks/indexedDB/winnerParticipant/addWinnerParticipantFromCloud";
import { removeWinnerParticipantFromCloud } from "~/hooks/indexedDB/winnerParticipant/removeWinnerParticipantFromCloud";

type RowComponentPropTypes = {
  itemId: number;
  onRemove: (id: number) => void;
  activeNth: number[];
  handleSkipSync: (prevId: number) => void;
  handleNextSync: (prevId: number) => void;
  initialData: any;
};

const RowComponent = ({
  itemId,
  onRemove,
  activeNth,
  handleSkipSync,
  handleNextSync,
  initialData
}: RowComponentPropTypes) => {
  const [refreshTable, setRefreshTable] = useLocalStorageState("refreshTable", {
    defaultValue: 0
  });

  const [syncingActive, setSyncingActive] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [statusCaption, setStatusCaption] = useState("Loading Data");
  const [isExiting, setIsExiting] = useState(false);

  const [itemData, setItemData] = useState<any>(null);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const loadData = async () => {
    const rawData = await getSyncQueueItemById(itemId);
    if (rawData) {
      setItemData(rawData);
    }
  };

  const downSyncerLobby = async (itemData: any) => {
    const syncType = itemData.type;
    setIsSyncing(true);
    switch (syncType) {
      case "sync-down-winner":
        const successDownSync = await downSyncer(
          itemData.id,
          addWinnerParticipantFromCloud
        );
        if (successDownSync) {
          setRefreshTable((prev) => {
            return prev + 1;
          });

          setIsSyncing(false);
        }
        break;

      case "sync-removal-winner":
        const successWinnerRemoval = await removeWinnerParticipantFromCloud(
          itemData.id,
          itemData.response_body
        );

        if (successWinnerRemoval) {
          setRefreshTable((prev) => {
            return prev + 1;
          });

          setIsSyncing(false);
        }
        break;

      default:
        break;
    }
  };

  const attemptSync = async () => {
    setIsSyncing(true);
    try {
      if (itemData.destination === "cloud-server") {
        await upSyncer(itemId);
      } else {
        console.log("downsyncing...");
        await downSyncerLobby(itemData);
      }
    } catch {
      handleSkipSync(itemId);
    } finally {
      setIsSyncing(false);
    }
  };

  useEffect(() => {
    if (!isSyncing) {
      if (itemData?.status === "completed") {
        console.log("Removing sync item #", itemId);
        setIsExiting(true);
        setStatusCaption("Removing Item...");
        handleNextSync(itemId);
        timeoutRef.current = setTimeout(() => {
          onRemove(itemId);
        }, 1000);
      } else if (syncingActive) {
        attemptSync();
      }
    }
  }, [itemData]);

  useEffect(() => {
    if (syncingActive) {
      intervalRef.current = setInterval(() => {
        loadData();
      }, 1000);
      setStatusCaption("Syncing...");
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      setStatusCaption("Paused");
    }

    return () => {
      // Clear interval when syncingActive changes or component unmounts
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [syncingActive]);

  useEffect(() => {
    setSyncingActive(activeNth.includes(itemId));
  }, [activeNth]);

  useEffect(() => {
    loadData();

    return () => {
      // Cleanup on component unmount
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <tr
      className={`transition-all overflow-hidden ${
        isExiting
          ? "h=[0px] bg-red-400 opacity-0 duration-700"
          : "h-[30px] opacity-100"
      } ${isSyncing && "!bg-green-800 text-white animate-pulse"}`}
    >
      <td className="px-4 py-2 text-center">
        {itemData?.id || initialData.id}
      </td>
      <td className="px-4 py-2 text-center flex justify-center items-center">
        {itemData?.source === "cloud-server" ? (
          <>
            <FontAwesomeIcon icon={faCloudArrowDown} className="pr-2" />{" "}
            Downsync
          </>
        ) : (
          <>
            <FontAwesomeIcon icon={faCloudArrowUp} className="pr-2" /> Upsync
          </>
        )}
      </td>
      <td className="px-4 py-2 text-center uppercase">
        {itemData?.method_type || initialData.method_type}
      </td>
      <td className="px-4 py-2 text-center">
        {itemData?.api_url || initialData.api_url}
      </td>
      <td className="px-4 py-2 text-center">
        {itemData?.status || initialData.status}
      </td>
      <td className="px-4 py-2 text-center">{statusCaption}</td>
    </tr>
  );
};

export default RowComponent;
