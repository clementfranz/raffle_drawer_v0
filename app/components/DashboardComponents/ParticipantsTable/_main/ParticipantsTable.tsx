import React, { use, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router";
import { openDB } from "idb";
import useLocalStorageState from "use-local-storage-state";
import {
  getAllParticipantsPerPage,
  getAllWinnerPerType,
  hasAnyParticipants,
  hasAnyWinners
} from "~/hooks/indexedDB/_main/useIndexedDB";
import { removeWinnerParticipant } from "~/hooks/indexedDB/winnerParticipant/removeWinnerParticipant";

interface Participant {
  id_entry: string;
  full_name: string;
  full_name_raw: string;
  full_name_cleaned?: string;
  raffle_code: string;
  regional_location: string;
  winner_type: string;
  draw_date: string;
  is_drawn: string;
}

const ParticipantsTable = ({}) => {
  const deleteEntryFromRaffleWinners = async (
    raffle_code: string,
    id_entry: string
  ) => {
    const result = await removeWinnerParticipant(id_entry, raffle_code);
    if (result) {
      setRefreshTable((prev) => {
        return prev + 1;
      });
    }
    console.log("Deletion: ", result);
  };

  const location = useLocation();

  const [withParticipantsData, setWithParticipantsData] = useLocalStorageState(
    "withParticipantsData",
    {
      defaultValue: false
    }
  );

  const [refreshTable, setRefreshTable] = useLocalStorageState("refreshTable", {
    defaultValue: 0
  });

  const [tableLocalData, setTableLocalData] = useState<Participant[] | null>(
    null
  );

  const [tableIsLoading, setTableIsLoading] = useState<boolean>(false);

  const [activeTab, setActiveTab] = useState("main");

  const [pageNum, setPageNum] = useState(1);
  const [pageSize, setPageSize] = useState(250);

  const getActiveTab = () => {
    const params = new URLSearchParams(location.search);
    const tab = params.get("filter") || "main";
    console.log("ACTIVE TAB: >>>>>", tab);
    setActiveTab(tab);
    return tab;
  };

  const getPageNumberAndSize = () => {
    const params = new URLSearchParams(location.search);
    const page = parseInt(params.get("page") || "1", 10);
    const size = parseInt(params.get("pageSize") || "250", 10);
    setPageNum(page);
    setPageSize(size);
    return { page, size };
  };

  const removeWinner = (code: string, id: string) => {
    deleteEntryFromRaffleWinners(code, id);
    fetchData();
  };

  const fetchData = async () => {
    setTableIsLoading(true);
    const activeTab = getActiveTab();

    console.log("Fetching data...");
    setTableIsLoading(true); // Start loading state early
    const { page: pageNumber, size: pageSize } = getPageNumberAndSize(); // Use the corrected function name

    try {
      let fetchedData: any[] = [];

      if (activeTab === "winners") {
        console.log("Winner table loading...");
        const hasPrimaryWinners = await hasAnyWinners("primary");

        if (hasPrimaryWinners) {
          const winnersData = await getAllWinnerPerType("primary");
          fetchedData = winnersData || [];
        } else {
          console.log("No primary winners found.");
        }
      } else if (activeTab === "backupwinners") {
        console.log("Backup winners table loading...");
        const hasBackupWinners = await hasAnyWinners("backup");

        if (hasBackupWinners) {
          const winnersData = await getAllWinnerPerType("backup"); // 🔥 Fixed this line!
          fetchedData = winnersData || [];
        } else {
          console.log("No backup winners found.");
        }
      } else {
        console.log("Main table loading...");
        const participantsData = await getAllParticipantsPerPage(
          "WEEK-2025-06",
          pageNumber,
          pageSize
        );
        fetchedData = participantsData || [];
      }

      // Set data (empty array if no winners found)
      setTableLocalData(fetchedData);
    } catch (error) {
      console.error("Error fetching data:", error);
      setTableLocalData([]); // Clear table on error
    } finally {
      setTableIsLoading(false); // Always end loading state
    }
  };

  useEffect(() => {
    fetchData();
  }, [withParticipantsData]);

  useEffect(() => {
    fetchData();
  }, [refreshTable]);

  useEffect(() => {
    setTableIsLoading(true);
    if (withParticipantsData) {
      fetchData();
    } else {
      setTableIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [location.search]);

  return (
    <>
      {tableLocalData && tableLocalData.length > 0 && !tableIsLoading ? (
        <div className="participants-table grow overflow-y-auto h-[500px]">
          <table className="min-w-full table-fixed border-separate border-spacing-0">
            <thead className="bg-[#bf4759] text-white sticky top-0 z-10">
              <tr>
                <th className="p-2 border-b w-[100px] text-center">#:</th>
                <th className="p-2 text-center border-b w-[150px]">
                  Entry No:
                </th>
                <th className="p-2 text-left border-b w-[400px]">
                  Participant's Name
                </th>
                <th className="p-2 border-b text-center">Code</th>
                <th className="p-2 border-b w-[200px] text-center">Location</th>
                {activeTab !== "main" ? (
                  <>
                    <th className="p-2 text-left border-b w-[160px]">
                      Draw Date
                    </th>
                    <th className="p-2 text-left border-b">Controls</th>
                  </>
                ) : (
                  <>
                    <th className="p-2 text-left border-b">Is Drawn</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody className="">
              {tableLocalData?.map((entry: Participant, index: number) => (
                <tr key={`participant-${entry.id_entry}-${index}`} className="">
                  <td className="text-center">
                    {((pageNum - 1) * pageSize + index + 1).toLocaleString()}
                  </td>
                  <td className="text-center font-mono">
                    #
                    {entry.id_entry
                      ?.toString()
                      .padStart(8, "0")
                      .replace(/(\d{2})(\d{3})(\d{3})/, "$1-$2-$3")}
                  </td>
                  <td
                    className=""
                    title={
                      activeTab !== "main"
                        ? `${entry.full_name_raw}`
                        : undefined
                    }
                  >
                    {entry.full_name || entry.full_name_cleaned}
                  </td>
                  <td className="text-base font-bold">{entry.raffle_code}</td>
                  <td className="text-center">{entry.regional_location}</td>
                  {activeTab !== "main" ? (
                    <>
                      <td>
                        {new Date(entry.draw_date).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "2-digit",
                          weekday: "short"
                        })}
                      </td>
                      <td className="">
                        <button
                          onClick={() => {
                            removeWinner(entry.raffle_code, entry.id_entry);
                          }}
                          className="bg-red-700 text-white p-1 px-2 rounded-lg hover:bg-red-600 cursor-pointer"
                        >
                          Remove
                        </button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td>{entry.is_drawn !== "false" && "⭐"}</td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <>
          <div className="participants-table grow overflow-y-auto h-[500px] drop-shadow-none flex bg-gray-300 justify-center items-center text-center">
            {tableIsLoading ? (
              <div className="flex flex-col justify-center gap-4 items-center">
                <div className="animate-spin bg-gray-200 h-[50px] w-[50px] aspect-square rounded-full relative">
                  <span className="bg-gray-600 h-[10px] w-[10px] block rounded-full absolute top-1/2 left-[5px]"></span>
                </div>
                Loading New Data. Please wait...
              </div>
            ) : (
              <>
                No data available... <br />
                Upload new data to continue
              </>
            )}
          </div>
        </>
      )}
    </>
  );
};

export default ParticipantsTable;
