import React from "react";

interface Participant {
  number: number;
  fullName: string;
  code: string;
  region: string;
}

interface ParticipantsTableProps {
  tableData: Participant[];
  loadingTable: boolean;
}

const ParticipantsTable: React.FC<ParticipantsTableProps> = ({
  tableData,
  loadingTable
}) => {
  return (
    <>
      {tableData.length > 0 ? (
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
              {tableData.map((entry) => (
                <tr key={entry.number} className="">
                  <td className="">{entry.number}</td>
                  <td className="">{entry.fullName}</td>
                  <td className="text-base font-bold">{entry.code}</td>
                  <td className="">{entry.region}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <>
          <div className="participants-table grow overflow-y-auto h-[500px] drop-shadow-none flex bg-gray-300 justify-center items-center text-center">
            {loadingTable ? (
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
