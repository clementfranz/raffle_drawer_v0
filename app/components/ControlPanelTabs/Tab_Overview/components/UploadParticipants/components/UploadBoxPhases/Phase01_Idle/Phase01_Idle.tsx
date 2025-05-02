import React, { useState } from "react";

// Other Packages
import Papa from "papaparse";

// Components
import UploadBox from "../../UploadBox/_main/UploadBox";
import UploadButton from "../../UploadButton/_main/UploadButton";

type IdleProps = {
  setFileAttached: React.Dispatch<React.SetStateAction<File | null>>;
  setFileDetails: React.Dispatch<React.SetStateAction<Object | null>>;
};

const Phase01_Idle = ({ setFileAttached, setFileDetails }: IdleProps) => {
  // DRAG STATES
  const [isDragging, setIsDragging] = useState(false);

  // FORM STATES
  type FormStateType = "default" | "undroppable" | "catcher";
  const [formState, setFormState] = useState<FormStateType>("default");

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);
    setFormState("catcher");
  };

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    setIsDragging(false);
    setFormState("default");
  };

  const handleDrop = async (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    setFormState("default");
    const files = event.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (file.type === "text/csv") {
        setFileAttached(file);
        const rows = await countCsvRows(file);
        setFileDetails({ entries: rows });
      } else {
        alert("Please upload a valid CSV file.");
      }
    }
  };

  const countCsvRows = (file: File): Promise<number> => {
    return new Promise((resolve, reject) => {
      let rowCount = 0;

      Papa.parse(file, {
        header: true, // ✅ Skip the header row
        skipEmptyLines: true,
        step: () => {
          rowCount++;
        },
        complete: () => {
          resolve(rowCount);
        },
        error: (error) => {
          reject(error);
        }
      });
    });
  };

  return (
    <div className="upload-phase ">
      <UploadBox
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`${isDragging && "bg-gray-300 text-gray-800 animate-pulse"}`}
      >
        {isDragging ? (
          <p className="text-xl">Drop CSV File Here</p>
        ) : (
          <>
            <UploadBox.Body className="flex justify-center items-center flex-col gap-4">
              <h2 className="text-base">
                Drag and drop a CSV file here or <br /> click button below to
                upload{" "}
              </h2>
              <p>
                Upload a CSV file with the participants data. The file should
                contain the following columns: Entry ID, Full Name, Raffle Code,
                Region/Location.
              </p>
            </UploadBox.Body>
            <UploadBox.Footer>
              <UploadButton>Select & Attach File</UploadButton>
            </UploadBox.Footer>
          </>
        )}
      </UploadBox>
    </div>
  );
};

export default Phase01_Idle;
