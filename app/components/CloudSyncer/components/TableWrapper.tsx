import React, { useEffect, useRef, useState } from "react";
import RowComponent from "./RowComponent";
import { getAllSyncQueueItems } from "~/hooks/indexedDB/syncCloud/getAllSyncQueueItems";
import { getAllPendingSyncQueueItems } from "~/hooks/indexedDB/syncCloud/getAllPendingSyncQueueItems";
import useLocalStorageState from "use-local-storage-state";

const TableWrapper = () => {
  const [rows, setRows] = useState<any[]>([]);
  const [activeNth, setActiveNth] = useState<number[]>([]);
  const [itemIdsArray, setItemIdsArray] = useState<any[]>([]);
  const [isCheckingNewData, setIsCheckingNewData] = useState<boolean>(false);

  const [withItems, setWithItems] = useState(true);

  const [isServerActive, setIsServerActive] = useLocalStorageState<boolean>(
    "isServerActive",
    { defaultValue: false }
  );

  const [activeSyncsTotal, setActiveSyncsTotal] = useLocalStorageState<number>(
    "activeSyncsTotal",
    { defaultValue: 0 }
  );

  const checkNewDataInterval = useRef<NodeJS.Timeout | null>(null);

  const triggerStartSync = () => {
    if (itemIdsArray.length > 0 && isServerActive) {
      // Limit to first 10 active items
      const maxActiveItems = 10;
      const limitedActiveIds = itemIdsArray.slice(0, maxActiveItems);
      setActiveNth(limitedActiveIds);
    } else {
      setActiveNth([]);
    }
  };

  const handleAddRow = (id: number) => {
    setRows((prev) => {
      if (prev.length >= 10 || prev.some((row) => row.id === id)) return prev;
      return [...prev, { id }];
    });

    setItemIdsArray((prev) => {
      if (prev.length >= 10 || prev.includes(id)) return prev;
      return [...prev, id];
    });
  };

  const handleSkipSync = (prevId: number) => {
    handleNextSync(prevId);
  };

  const handleNextSync = (prevId: number) => {
    const coolDownTimeout = setTimeout(() => {
      if (itemIdsArray.length > 0) {
        setItemIdsArray((prev) => prev.filter((item) => item.id !== prevId));
      } else {
        checkNewData();
      }
      clearTimeout(coolDownTimeout);
    }, 1000);
  };

  const handleRemoveRow = (id: number) => {
    setRows((prev) => prev.filter((row) => row.id !== id));
    setItemIdsArray((prev) => prev.filter((itemId) => itemId !== id));

    // Trigger check if we fall below 10
    setTimeout(() => {
      if (itemIdsArray.length < 10) checkNewData();
    }, 300);
  };

  const checkNewData = async () => {
    console.log("Checking for new queue items...");

    if (itemIdsArray.length >= 10) {
      console.log("Max 10 sync items already active.");
      return;
    }

    if (!isCheckingNewData) {
      setIsCheckingNewData(true);
      const currentRowsCount = itemIdsArray.length;
      const itemsToGet = 10 - currentRowsCount;

      if (itemsToGet === 0) {
        setIsCheckingNewData(false);
        return;
      }

      console.log("Attempting to get new data with total of ", itemsToGet);
      const newData = await getAllPendingSyncQueueItems(
        itemsToGet,
        itemIdsArray
      );

      if (newData) {
        const newDataIds = newData
          .map((data) => data.id)
          .sort((a, b) => a - b)
          .slice(0, itemsToGet);

        const filteredNewDataIds = newDataIds.filter(
          (id) => !itemIdsArray.includes(id)
        );

        filteredNewDataIds.forEach((id) => {
          handleAddRow(id);
        });
      }
      setIsCheckingNewData(false);
    }
  };

  useEffect(() => {
    setActiveSyncsTotal(itemIdsArray.length);
    if (itemIdsArray.length === 0) {
      setWithItems(false);
      setActiveNth([]);
    } else {
      if (!withItems) {
        setWithItems(true);
      }
      setActiveNth(itemIdsArray.slice(0, 5));
    }
    if (
      itemIdsArray.length > 0 &&
      (activeNth.length === 0 || activeNth === undefined || activeNth === null)
    ) {
      triggerStartSync();
    }
  }, [itemIdsArray]);

  useEffect(() => {
    if (!withItems && itemIdsArray.length < 5) {
      checkNewDataInterval.current = setInterval(() => {
        checkNewData();
      }, 2000);
    } else {
      if (checkNewDataInterval.current) {
        clearInterval(checkNewDataInterval.current);
        checkNewDataInterval.current = null;
      }
    }
  }, [withItems]);

  useEffect(() => {
    if (isServerActive) {
      triggerStartSync();
    } else {
      setActiveNth([]);
    }
  }, [isServerActive]);

  useEffect(() => {
    console.log("Cloud syncing activated");
    triggerStartSync();
  }, []);

  return (
    <div>
      <div className="flex justify-between">
        <div className="flex gap-2 items-center">
          <span>Syncing Queue Item:</span>
          {activeNth.map((nth, index) => (
            <span
              key={index}
              className="bg-green-800 text-white p-1 px-2 rounded-2xl"
            >
              #{nth}
            </span>
          ))}
        </div>
        <div className="flex gap-3 items-center">
          <span>Total Items in Queue:</span>
          <span className="bg-green-800 text-white p-1 px-2 rounded-2xl min-w-[50px] text-center">
            {itemIdsArray.length}
          </span>
          {activeNth.length < 1 &&
            itemIdsArray.length > 0 &&
            isServerActive && (
              <button
                onClick={triggerStartSync}
                className="cursor-pointer bg-amber-500 hover:bg-amber-600 p-1 px-2 rounded-2xl"
              >
                Trigger Sync
              </button>
            )}
        </div>
      </div>
      <table className="mt-4 w-full table-auto">
        <thead>
          <tr>
            <th className="bg-gray-300 px-4 py-2 font-bold w-[80px]">ID #</th>
            <th className="bg-gray-300 px-4 py-2 font-bold w-[80px]">Type</th>
            <th className="bg-gray-300 px-4 py-2">Method</th>
            <th className="bg-gray-300 px-4 py-2">Data API URL</th>
            <th className="bg-gray-300 px-4 py-2 w-[150px]">Sync Status</th>
            <th className="bg-gray-300 px-4 py-2 w-[150px]">Status</th>
          </tr>
        </thead>
        <tbody className="bg-red-300 grow">
          {rows.map((row) => (
            <RowComponent
              key={row.id}
              itemId={row.id}
              onRemove={handleRemoveRow}
              activeNth={activeNth}
              handleSkipSync={handleSkipSync}
              handleNextSync={handleNextSync}
              initialData={row}
            />
          ))}
          {rows.length <= 0 && (
            <tr className="w-full grow !h-full">
              <td colSpan={6}>
                No queue items found to sync. Please refresh page to check for
                new items.{" "}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TableWrapper;
