import React, { useState } from "react";
import { exportCSVAuto } from "~/hooks/csvParser/exportCSV";
import { getAllWinnerPerType } from "~/hooks/indexedDB/_main/useIndexedDB";
import TabSubPanel from "~/ui/ControlPanelUI/TabSubPanel/_main/TabSubPanel";

const ExportWinnerData = () => {
  const [loadingPrimaryWinnersCSV, setLoadingPrimaryWinnersCSV] =
    useState(false);
  const [primaryWinnersButtonLabel, setPrimaryWinnersButtonLabel] =
    useState("Primary Winners");

  const [loadingBackupWinnersCSV, setLoadingBackupWinnersCSV] = useState(false);
  const [backupWinnersButtonLabel, setBackupWinnersButtonLabel] =
    useState("Backup Winners");

  const handleExportPrimaryWinners = async () => {
    setLoadingPrimaryWinnersCSV(true);
    setPrimaryWinnersButtonLabel("Processing CSV Data");
    const entries = await getAllWinnerPerType("primary");
    const timeStamp = new Date()
      .toISOString()
      .replace(/[-:]/g, "_")
      .split(".")[0];
    const fileName = `KBRDS_Primary_Winners_${timeStamp}.csv`;
    if (entries) {
      const successExport = await exportCSVAuto(entries, fileName);
      if (successExport) {
        setLoadingPrimaryWinnersCSV(false);
        setPrimaryWinnersButtonLabel("Primary Winners");
      }
    }
  };

  const handleExportBackupWinners = async () => {
    setLoadingBackupWinnersCSV(true);
    setBackupWinnersButtonLabel("Processing CSV Data");
    const entries = await getAllWinnerPerType("backup");
    const timeStamp = new Date()
      .toISOString()
      .replace(/[-:]/g, "_")
      .split(".")[0];
    const fileName = `KBRDS_Backup_Winners_${timeStamp}.csv`;
    if (entries) {
      const successExport = await exportCSVAuto(entries, fileName);
      if (successExport) {
        setLoadingBackupWinnersCSV(false);
        setBackupWinnersButtonLabel("Backup Winners");
      }
    }
  };

  return (
    <TabSubPanel
      title={"Export Winner Data"}
      className="pt-4 border-t-2 border-solid border-gray-300 mt-4"
    >
      <p className="text-sm">Choose winner type to download:</p>
      <div className="grid grid-cols-2 gap-2 pt-2">
        <div
          className={`button-1  p-3 text-center rounded-2xl aspect-video flex justify-center items-center px-5 cursor-pointer  ${
            !loadingPrimaryWinnersCSV
              ? "bg-emerald-800 hover:bg-emerald-700"
              : "disabled bg-red-800"
          }`}
          onClick={handleExportPrimaryWinners}
        >
          <div className="text-base">{primaryWinnersButtonLabel}</div>
        </div>
        <div
          className={`button-1  p-3 text-center rounded-2xl aspect-video flex justify-center items-center px-5 cursor-pointer  ${
            !loadingBackupWinnersCSV
              ? "bg-emerald-800 hover:bg-emerald-700"
              : "disabled bg-red-800"
          }`}
          onClick={handleExportBackupWinners}
        >
          <div className="text-base">{backupWinnersButtonLabel}</div>
        </div>
      </div>
      <p className="text-sm italic mt-3">Data are updated in real time.</p>
    </TabSubPanel>
  );
};

export default ExportWinnerData;
