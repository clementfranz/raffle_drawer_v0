import { useState } from "react";
import { useIndexedDB } from "./useIndexedDB";
import Papa from "papaparse";

export const useFileUpload = () => {
  const [attachedFile, setAttachedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [fileInfo, setFileInfo] = useState<{
    rowCount: number;
    fileName: string;
  } | null>(null);

  const { saveBatchToIndexedDB, openDatabase } = useIndexedDB();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setAttachedFile(file || null);
    setFileInfo({ rowCount: 0, fileName: file?.name || "" });
  };

  const handleFileUpload = async () => {
    if (!attachedFile) return;

    setIsProcessing(true);
    const db = await openDatabase();

    Papa.parse(attachedFile, {
      header: true,
      skipEmptyLines: true,
      worker: true,
      chunk: async (results) => {
        // Process each batch
        const batch = results.data as any[];
        await saveBatchToIndexedDB(db, batch);
        setFileInfo((prev) => ({
          ...prev!,
          rowCount: (prev?.rowCount || 0) + batch.length
        }));
      },
      complete: () => {
        setIsProcessing(false);
      }
    });
  };

  return {
    handleFileChange,
    handleFileUpload,
    isProcessing,
    fileInfo
  };
};
