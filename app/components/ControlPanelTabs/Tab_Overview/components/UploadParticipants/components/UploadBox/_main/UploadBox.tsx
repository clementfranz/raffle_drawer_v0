import React, { useState, useRef, type ReactNode } from "react";

// Upload Box Sub Components
import UploadBoxHeader from "../components/UploadBoxHeader/_main/UploadBoxHeader";
import UploadBoxBody from "../components/UploadBoxBody/_main/UploadBoxBody";
import UploadBoxFooter from "../components/UploadBoxFooter/_main/UploadBoxFooter";

type UploadBoxProps = {
  children?: ReactNode;
  className?: string;
  onDragOver?: (event: React.DragEvent<HTMLDivElement>) => void;
  onDragLeave?: (event: React.DragEvent<HTMLDivElement>) => void;
  onDrop?: (event: React.DragEvent<HTMLDivElement>) => void;
  fileStates?: {
    fileName: string;
    setFileName: React.Dispatch<React.SetStateAction<string>>;
    attachedFile: File | null;
    setAttachedFile: React.Dispatch<React.SetStateAction<File | null>>;
  }; // Updated type for fileStates
};

type formStateProps = "default" | "catcher" | "undroppable";

const defaultStyling =
  "w-full p-4 border-dashed rounded-lg border-2 text-center transition-all duration-200 aspect-[5/4] flex flex-col justify-center items-center relative";

const UploadBox = ({
  children,
  className,
  onDragOver,
  onDragLeave,
  onDrop
}: UploadBoxProps) => {
  // FILE STATES

  return (
    <div
      className={`${defaultStyling} ${className}`}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
    >
      {children}
    </div>
  );
};

UploadBox.Header = UploadBoxHeader;
UploadBox.Body = UploadBoxBody;
UploadBox.Footer = UploadBoxFooter;

export default UploadBox;
