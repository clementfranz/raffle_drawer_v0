import React, { useRef } from "react";

import UploadButton from "../../UploadButton/_main/UploadButton";

const Phase02_Attached = () => {
  return <div>Phase02_Attached</div>;
};

const Header = () => {
  return (
    <div>
      Drag and drop a CSV file here <br /> or click button below to upload
    </div>
  );
};

type BodyProps = {
  attachedFile?: File | null;
};

const Body = ({ attachedFile }: BodyProps) => {
  return <>FileName: {attachedFile?.name}</>;
};

type FooterProps = {
  setUploadStatus?: React.Dispatch<
    React.SetStateAction<
      "idle" | "attached" | "processing" | "error" | "completed"
    >
  >;
  setAttachedFile?: React.Dispatch<React.SetStateAction<File | null>>;
};

const Footer = ({ setAttachedFile, setUploadStatus }: FooterProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null!);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      e.target.value = ""; // Reset the input value
      if (setAttachedFile) {
        setAttachedFile(null); // Clear the last attached file
        setAttachedFile(e.target.files[0]);
      }
      if (setUploadStatus) {
        setUploadStatus("attached");
      }
    }
  };

  return (
    <>
      <UploadButton>Submit File</UploadButton>

      <input
        ref={fileInputRef}
        type="file"
        id="fileInput"
        accept=".csv"
        className="hidden"
        onChange={(e) => handleFileChange(e)}
        aria-label="File Upload"
      />
    </>
  );
};

Phase02_Attached.Header = Header;
Phase02_Attached.Body = Body;
Phase02_Attached.Footer = Footer;

export default Phase02_Attached;
