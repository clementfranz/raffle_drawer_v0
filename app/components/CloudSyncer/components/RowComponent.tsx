import React, { useEffect, useState } from "react";
import { upSyncer } from "~/api/client/syncCloud/upSyncer";
import { getSyncQueueItemById } from "~/hooks/indexedDB/syncCloud/getSyncQueueItemById";

type RowComponentPropTypes = {
  itemId: number;
  onRemove: (id: number) => void;
  activeNth: number;
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
  const [syncingActive, setSyncingActive] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [statusCaption, setStatusCaption] = useState("Loading Data");

  const [isExiting, setIsExiting] = useState(false);

  type ItemDataType = {
    id: number;
    [key: string]: any; // Add other properties as needed
  };

  const [itemData, setItemData] = useState<ItemDataType | null>(null);

  const loadData = async () => {
    const rawData = await getSyncQueueItemById(itemId);
    if (rawData) {
      setItemData(rawData);
    }
  };

  const attemptSync = async () => {
    setIsSyncing(true);
    try {
      const sync = await upSyncer(itemId);
      if (sync) {
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
        const selfRemoveTimeout = setTimeout(() => {
          onRemove(itemId);
          clearTimeout(selfRemoveTimeout);
        }, 1000);
      } else if (syncingActive) {
        attemptSync();
      }
    }
  }, [itemData]);

  const startSync = (on: boolean) => {
    let checkStatusInterval;
    if (on) {
      checkStatusInterval = setInterval(() => {
        loadData();
      }, 2500);
    } else {
      clearInterval(checkStatusInterval);
    }
  };

  const getInitialData = async () => {
    const initialData = await getSyncQueueItemById(itemId);
    if (initialData) {
      setItemData(initialData);
    }
  };

  useEffect(() => {
    if (syncingActive) {
      startSync(true);
      setStatusCaption("Syncing...");
    } else {
      startSync(false);
      setStatusCaption("Paused");
    }
  }, [syncingActive]);

  useEffect(() => {
    if (activeNth === itemId) {
      setSyncingActive(true);
    } else {
      setSyncingActive(false);
    }
  }, [activeNth]);

  useEffect(() => {
    getInitialData();
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
