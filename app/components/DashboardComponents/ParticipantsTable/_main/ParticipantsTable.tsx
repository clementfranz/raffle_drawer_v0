import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router";
import { openDB } from "idb";

interface Participant {
  id_entry: number;
  full_name: string;
  raffle_code: string;
  regional_location: string;
}

interface ParticipantsTableProps {
  tableData: Participant[];
  loadingTable: boolean;
}

const ParticipantsTable: React.FC<ParticipantsTableProps> = ({
  tableData,
  loadingTable
}) => {
  const location = useLocation();

  const [tableLocalData, setTableLocalData] = useState<Participant[] | null>(
    null
  );
  const [tableIsLoading, setTableIsLoading] = useState<boolean>(false);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(250);

  const getDataPerPage = async (
    dbName: string,
    storeName: string,
    pageNo: number,
    size: number
  ): Promise<any[]> => {
    setTableIsLoading(true);
    const db = await openDB(dbName, 1);
    const tx = db.transaction(storeName, "readonly");
    const store = tx.objectStore(storeName);

    const startId = (pageNo - 1) * size + 1;
    const endId = pageNo * size;

    const range = IDBKeyRange.bound(startId, endId);
    const data: any[] = [];

    let cursor = await store.openCursor(range);

    while (cursor) {
      data.push(cursor.value);
      cursor = await cursor.continue();
    }

    await tx.done;
    setTableIsLoading(false);
    return data;
  };

  const checkUrlAndSetPage = () => {
    const params = new URLSearchParams(location.search);

    const page = parseInt(params.get("page") || "1", 10);
    const size = parseInt(params.get("pageSize") || "100", 10);

    setPageNumber(page);
    setPageSize(size);
  };

  useEffect(() => {
    checkUrlAndSetPage();
  }, [location.search]); // run when URL changes

  useEffect(() => {
    const fetchData = async () => {
      const page1 = await getDataPerPage(
        "ParticipantsDB",
        "participantsData_raffle2025",
        pageNumber,
        pageSize
      );
      console.log("Page 1:", page1);
      setTableLocalData(page1);
      setTableIsLoading(false);
    };

    setTableIsLoading(true);
    fetchData();
  }, [pageNumber, pageSize]); // run when pageNumber or pageSize changes

  useEffect(() => {
    checkUrlAndSetPage();
  }, []);

  return (
    <>
      {tableLocalData && tableLocalData.length > 0 && !tableIsLoading ? (
        <div className="participants-table grow overflow-y-auto h-[500px]">
          <table className="min-w-full table-fixed border-separate border-spacing-0">
            <thead className="bg-[#bf4759] text-white sticky top-0 z-10">
              <tr>
                <th className="p-2 text-left border-b">No.:</th>
                <th className="p-2 text-left border-b">Participant's Name</th>
                <th className="p-2 text-left border-b">Code</th>
                <th className="p-2 text-left border-b">Location</th>
              </tr>
            </thead>
            <tbody className="">
              {tableLocalData?.map((entry: Participant, index: number) => (
                <tr key={`participant-${entry.id_entry}-${index}`} className="">
                  <td className="">
                    #
                    {entry.id_entry
                      .toString()
                      .padStart(8, "0")
                      .replace(/(\d{2})(\d{3})(\d{3})/, "$1-$2-$3")}
                  </td>
                  <td className="">{entry.full_name}</td>
                  <td className="text-base font-bold">{entry.raffle_code}</td>
                  <td className="">{entry.regional_location}</td>
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
