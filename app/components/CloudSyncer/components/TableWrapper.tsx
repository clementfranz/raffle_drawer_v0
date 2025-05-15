import React, { useEffect, useRef, useState } from "react";
import RowComponent from "./RowComponent";
import { getAllSyncQueueItems } from "~/hooks/indexedDB/syncCloud/getAllSyncQueueItems";
import { getAllPendingSyncQueueItems } from "~/hooks/indexedDB/syncCloud/getAllPendingSyncQueueItems";
import useLocalStorageState from "use-local-storage-state";

const TableWrapper = () => {
  const [rows, setRows] = useState<any[]>([]);
  const [activeNth, setActiveNth] = useState<number>(0);
  const [itemIdsArray, setItemIdsArray] = useState<any[]>([]);
  const [isCheckingNewData, setIsCheckingNewData] = useState<boolean>(false);

  const [withItems, setWithItems] = useState(true);

  const [isServerActive, setIsServerActive] = useLocalStorageState<boolean>(
    "isServerActive",
    { defaultValue: false }
  );

  const checkNewDataInterval = useRef<NodeJS.Timeout | null>(null);

  const triggerStartSync = () => {
    if (itemIdsArray.length > 0 && isServerActive) {
      setActiveNth(itemIdsArray[0]);
    } else {
      setActiveNth(0);
    }
  };

  const handleAddRow = (id: number) => {
    setRows((prev) =>
      prev.some((row) => row.id === id) ? prev : [...prev, { id }]
    );
    setItemIdsArray((prev) => (prev.includes(id) ? prev : [...prev, id]));
  };

  const handleSkipSync = (prevId: number) => {
    handleNextSync(prevId);
  };

  const handleNextSync = (prevId: number) => {
    const coolDownTimeout = setTimeout(() => {
      const counterPosition = itemIdsArray.indexOf(prevId);
      if (itemIdsArray.length > 0) {
        setActiveNth(itemIdsArray[counterPosition + 1]);
      } else {
        checkNewData();
      }
      clearTimeout(coolDownTimeout);
    }, 1000);
  };

  const handleRemoveRow = (id: number) => {
    setRows((prev) => prev.filter((row) => row.id !== id));
    setItemIdsArray((prev) => prev.filter((itemId) => itemId !== id));
    checkNewData();
  };

  const checkNewData = async () => {
    console.log("Checking for new queue items...");
    if (itemIdsArray.length >= 6) {
      console.log("Sync Slots of 5 to 6 is still full. Will try again later");
      return;
    }
    if (!isCheckingNewData) {
      setIsCheckingNewData(true);
      const currentRowsCount = itemIdsArray.length;
      const itemsToGet = 6 - currentRowsCount;
      console.log("Attempting to get new data with total of ", itemsToGet);
      const newData = await getAllPendingSyncQueueItems(
        itemsToGet,
        itemIdsArray
      );

      if (newData) {
        console.log("Returned data with total of ", newData.length);
        const newDataIds = newData.map((data) => data.id);

        const filteredNewDataIds = newDataIds.filter(
          (id) => !itemIdsArray.includes(id)
        );

        console.log("Filtered new IDs:", filteredNewDataIds);
        // Do something with filteredNewDataIds...

        filteredNewDataIds.forEach((data) => {
          handleAddRow(data);
        });
        setIsCheckingNewData(false);
      }
    }
  };

  const initializeData = async () => {
    console.log("Initializing data...");
    const initialData = await getAllPendingSyncQueueItems(5);
    if (initialData) {
      const sortedData = initialData.sort((a, b) => a.id - b.id);
      const ids = sortedData.map((data) => data.id);
      setItemIdsArray(ids);
      if (isServerActive) {
        setActiveNth(ids[0]);
      } else {
        setActiveNth(0);
      }
      console.log("Item IDS Array: ", ids);
      setRows(sortedData);
    }
  };

  useEffect(() => {
    if (itemIdsArray.length === 0) {
      setWithItems(false);
    } else {
      if (!withItems) {
        setWithItems(true);
      }
    }
    if (
      itemIdsArray.length > 0 &&
      (activeNth === 0 || activeNth === undefined || activeNth === null)
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
      setActiveNth(0);
    }
  }, [isServerActive]);

  useEffect(() => {
    console.log("Cloud syncing activated");
    initializeData();
  }, []);

  return (
    <div>
      <div className="flex justify-between">
        <div className="flex gap-3 items-center">
          <span>Syncing Queue Item:</span>
          <span className="bg-green-800 text-white p-1 px-2 rounded-2xl">
            #{activeNth}
          </span>
        </div>
        <div className="flex gap-3 items-center">
          <span>Total Items in Queue:</span>
          <span className="bg-green-800 text-white p-1 px-2 rounded-2xl min-w-[50px] text-center">
            {itemIdsArray.length}
          </span>
          {activeNth < 1 && itemIdsArray.length > 0 && isServerActive && (
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
            <th className="bg-gray-300 px-4 py-2">
              Data (Active Process is #{activeNth})
            </th>
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
              <td colSpan={4}>
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
