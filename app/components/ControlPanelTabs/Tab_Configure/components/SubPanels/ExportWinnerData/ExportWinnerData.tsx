import React, { useEffect, useState } from "react";
import useLocalStorageState from "use-local-storage-state";
import { exportCSVAuto } from "~/hooks/csvParser/exportCSV";
import {
  getAllWinnerPerType,
  hasAnyWinners
} from "~/hooks/indexedDB/_main/useIndexedDB";
import TabSubPanel from "~/ui/ControlPanelUI/TabSubPanel/_main/TabSubPanel";

const ExportWinnerData = () => {
  const [loadingPrimaryWinnersCSV, setLoadingPrimaryWinnersCSV] =
    useState(false);
  const [primaryWinnersButtonLabel, setPrimaryWinnersButtonLabel] =
    useState("Primary Winners");

  const [loadingBackupWinnersCSV, setLoadingBackupWinnersCSV] = useState(false);
  const [backupWinnersButtonLabel, setBackupWinnersButtonLabel] =
    useState("Backup Winners");

  const [winnersDataAvailable, setWinnersDataAvailable] = useLocalStorageState(
    "winnersDataAvailable",
    { defaultValue: false }
  );

  const [refreshTable] = useLocalStorageState("refreshTable");

  const [primaryWinnersDataAvailable, setPrimaryWinnersDataAvailable] =
    useState(false);
  const [backupWinnersDataAvailable, setBackupWinnersDataAvailable] =
    useState(false);

  const handleExportPrimaryWinners = async () => {
    if (!primaryWinnersDataAvailable) {
      return;
    }
    setLoadingPrimaryWinnersCSV(true);
    setPrimaryWinnersButtonLabel("Processing CSV Data");
    const entries = await getAllWinnerPerType("primary");
    const excludeHeaders = [
      "is_drawn",
      "winner_status",
      "is_archived",
      "participant_batch_id"
    ];
    const timeStamp = new Date(
      Date.now() + 8 * 60 * 60 * 1000 // Add 8 hours for PH time
    )
      .toISOString()
      .replace(/[-:]/g, "_")
      .replace("T", "__")
      .split(".")[0]; // Remove milliseconds if you don’t want them

    const fileName = `KBRDS_Primary_Winners_${timeStamp}.csv`;
    if (entries) {
      const successExport = await exportCSVAuto(
        entries,
        fileName,
        excludeHeaders
      );
      if (successExport) {
        setLoadingPrimaryWinnersCSV(false);
        setPrimaryWinnersButtonLabel("Primary Winners");
      }
    }
  };

  const handleExportBackupWinners = async () => {
    if (!backupWinnersDataAvailable) {
      return;
    }
    setLoadingBackupWinnersCSV(true);
    setBackupWinnersButtonLabel("Processing CSV Data");
    const entries = await getAllWinnerPerType("backup");
    const excludeHeaders = [
      "is_drawn",
      "winner_status",
      "is_archived",
      "participant_batch_id"
    ];
    const timeStamp = new Date(
      Date.now() + 8 * 60 * 60 * 1000 // Add 8 hours for PH time
    )
      .toISOString()
      .replace(/[-:]/g, "_")
      .replace("T", "__")
      .split(".")[0]; // Remove milliseconds if you don’t want them

    const fileName = `KBRDS_Backup_Winners_${timeStamp}.csv`;
    if (entries) {
      const successExport = await exportCSVAuto(
        entries,
        fileName,
        excludeHeaders
      );
      if (successExport) {
        setLoadingBackupWinnersCSV(false);
        setBackupWinnersButtonLabel("Backup Winners");
      }
    }
  };

  const fetchWinnersData = async () => {
    const winnersDataPrimary = await hasAnyWinners("primary");
    const winnersDataBackup = await hasAnyWinners("backup");
    if (!winnersDataPrimary && !winnersDataBackup) {
      setWinnersDataAvailable(false);
    } else {
      if (winnersDataPrimary) {
        setPrimaryWinnersDataAvailable(true);
      }
      if (winnersDataBackup) {
        setBackupWinnersDataAvailable(true);
      }
      setWinnersDataAvailable(true);
    }
  };

  useEffect(() => {
    fetchWinnersData();
  }, [refreshTable]);

  useEffect(() => {
    fetchWinnersData();
  }, []);

  return (
    <TabSubPanel
      title={"Export Winner Data"}
      className="pt-4 border-t-2 border-solid border-gray-300 mt-4"
    >
      <p className="text-sm">Choose winner type to download:</p>
      {winnersDataAvailable ? (
        <>
          <div className="grid grid-cols-2 gap-2 pt-2">
            <div
              className={`button-1  p-3 text-center rounded-2xl aspect-video flex justify-center items-center px-5   ${
                !primaryWinnersDataAvailable
                  ? "bg-gray-500 text-black cursor-not-allowed"
                  : !loadingPrimaryWinnersCSV
                  ? "bg-emerald-800 hover:bg-emerald-700 cursor-pointer"
                  : "disabled bg-red-800 cursor-not-allowed"
              }`}
              onClick={handleExportPrimaryWinners}
            >
              <div className="text-base">
                {primaryWinnersDataAvailable
                  ? primaryWinnersButtonLabel
                  : "No Data for Primary Winners"}
              </div>
            </div>
            <div
              className={`button-1  p-3 text-center rounded-2xl aspect-video flex justify-center items-center px-5   ${
                !backupWinnersDataAvailable
                  ? "bg-gray-500 text-black cursor-not-allowed"
                  : !loadingBackupWinnersCSV
                  ? "bg-emerald-800 hover:bg-emerald-700 cursor-pointer"
                  : "disabled bg-red-800 cursor-not-allowed"
              }`}
              onClick={handleExportBackupWinners}
            >
              <div className="text-base">
                {backupWinnersDataAvailable
                  ? backupWinnersButtonLabel
                  : "No Data for Backup Winners"}
              </div>
            </div>
          </div>
          <p className="text-sm italic mt-3">Data are updated in real time.</p>
        </>
      ) : (
        <div className="mt-6 text-red-400">
          No data available for winners. <br />
          Start raffle to have winners.
        </div>
      )}
    </TabSubPanel>
  );
};

export default ExportWinnerData;
