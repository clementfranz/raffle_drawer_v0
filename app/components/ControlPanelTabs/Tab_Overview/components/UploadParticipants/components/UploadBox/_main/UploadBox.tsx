import React, { useState, useRef, type ReactNode } from "react";

// Upload Box Sub Components
import UploadBoxHeader from "../components/UploadBoxHeader/_main/UploadBoxHeader";
import UploadBoxBody from "../components/UploadBoxBody/_main/UploadBoxBody";
import UploadBoxFooter from "../components/UploadBoxFooter/_main/UploadBoxFooter";

type UploadBoxProps = {
  children: ReactNode;
  uploadState: "idle" | "attached" | "processing" | "error" | "completed";
};

const defaultStyling =
  "w-full p-4 border-dashed rounded-lg border-2 text-center transition-all duration-200 aspect-[5/4] flex flex-col justify-center items-center relative";

const uploadStateStyling = (uploadState: UploadBoxProps["uploadState"]) => {
  switch (uploadState) {
    case "attached":
      return "border-blue-500 bg-blue-800 hover:bg-blue-400 text-gray-800";
    case "processing":
      return "border-yellow-500 animate-pulse";
    case "error":
      return "border-red-500 bg-red-100";
    case "completed":
      return "border-green-500 bg-green-100";
    default:
      return "border-gray-500 bg-gray-950 hover:bg-gray-800 text-gray-300";
  }
};

const formStateStyling = (formState: UploadBoxProps["formState"]) => {
  switch (formState) {
    case "catcher":
      return "bg-pink-700 border-gray-300 animate-pulse";

    default:
      break;
  }
};

const UploadBox = ({ children, uploadState }: UploadBoxProps) => {
  // FILE STATES
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [fileName, setFileName] = useState("");
  const [attachedFile, setAttachedFile] = useState<File | null>(null);

  // DRAG STATES
  const [isDragging, setIsDragging] = useState(false);

  // UPLOAD STATES
  const [isProcessing, setIsProcessing] = useState(false);

  // FORM STATES
  type FormStateType = "default" | "undroppable" | "catcher";
  const [formState, setFormState] = useState<FormStateType>("default");

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setAttachedFile(file || null);
    setIsProcessing(true);
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);
    setFormState("catcher");
  };

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    setIsDragging(false);
    setFormState("default");
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    const files = event.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (file.type === "text/csv") {
        console.log("CSV file dropped:", file.name);
        setFileName(file.name);
        setAttachedFile(file);
      } else {
        alert("Please upload a valid CSV file.");
      }
    }
  };

  return (
    <div
      className={`${defaultStyling} ${
        formState === "default"
          ? uploadStateStyling(uploadState)
          : formStateStyling(formState)
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {isDragging ? "Drop CSV File Here" : children}
      <input
        ref={fileInputRef}
        type="file"
        id="fileInput"
        accept=".csv"
        className="hidden"
        onChange={handleFileChange}
        aria-label="File Upload"
      />
    </div>
  );
};

UploadBox.Header = UploadBoxHeader;
UploadBox.Body = UploadBoxBody;
UploadBox.Footer = UploadBoxFooter;

export default UploadBox;
