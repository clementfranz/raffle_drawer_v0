import React, { useState } from "react";

interface Tab_OverviewProps {
  setIsPresenting?: React.Dispatch<React.SetStateAction<boolean>>;
  isPresenting?: boolean;
}

const Tab_Overview: React.FC<Tab_OverviewProps> = ({
  setIsPresenting,
  isPresenting
}) => {
  const startPresentation = () => {
    if (setIsPresenting) {
      setIsPresenting(true);
    }
    window.open(
      "/present",
      "_blank",
      "width=1300,height=600,noopener,noreferrer"
    );
  };

  const [withParticipants, setWithParticipants] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);

  return (
    <>
      <div className="top-part grow p-4 overflow-y-scroll bg-gradient-to-b from-gray-900 to-gray-800">
        <div className="sub-panel mb-3">
          <h2 className="mb-2">Participants List Summary</h2>
          {withParticipants ? (
            <p>With Participants</p>
          ) : (
            <div className="flex flex-col gap-2 text-sm">
              <div className="message  text-gray-300 text-center italic">
                No participants found.{" "}
              </div>
              <div className="upload-data">
                <p className="text-gray-300 text-sm mb-2">
                  Upload participants data
                </p>
                <div
                  className={`upload-data-shell bg-gray-950 p-4 border-dashed border-gray-500 rounded-lg border-2 text-center cursor-pointer transition-all duration-200 h-[100px] flex flex-col justify-center items-center ${
                    isDragging
                      ? "bg-pink-700 border-gray-300 animation-pulse"
                      : fileName
                      ? "bg-green-600 text-black"
                      : "hover:bg-gray-800 text-gray-300"
                  }`}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setIsDragging(false);
                    const files = e.dataTransfer.files;
                    if (files.length > 0) {
                      const file = files[0];
                      if (file.type === "text/csv") {
                        console.log("CSV file dropped:", file.name);
                        setFileName(file.name); // Update state with file name
                        // Handle file processing here
                      } else {
                        alert("Please upload a valid CSV file.");
                      }
                    }
                  }}
                  onClick={() => document.getElementById("fileInput")?.click()}
                >
                  <p className="text-sm">
                    {isDragging
                      ? "Drop the file here"
                      : fileName
                      ? `File selected: ${fileName}`
                      : "Drag and drop a CSV file here or click to upload"}
                  </p>
                  <input
                    type="file"
                    id="fileInput"
                    accept=".csv"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        if (file.type === "text/csv") {
                          console.log("CSV file selected:", file.name);
                          setFileName(file.name); // Update state with file name
                          // Handle file processing here
                        } else {
                          alert("Please upload a valid CSV file.");
                        }
                      }
                    }}
                  />
                </div>
                <p className="text-gray-300  mt-2 text-xs">
                  Upload a CSV file with the participants data. The file should
                  contain the following columns: Full Name, Alpha Numeric Code,
                  Region/Location.
                  <br />{" "}
                </p>
                <div className="flex justify-end items-center gap-2">
                  <button className="bg-gray-600 hover:bg-gray-500 px-4 h-[40px] rounded-2xl cursor-pointer mt-2 flex items-center gap-2">
                    Upload
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="sub-panel mb-3">
          <h2 className="mb-2">Regional Total:</h2>
          <ul className="text-gray-300 text-sm flex flex-col gap-2">
            <ol>Luzon</ol>
            <ol>Vizayas</ol>
            <ol>Mindanao</ol>
          </ul>
        </div>
      </div>
      <div className="bottom-part flex justify-between items-center text-sm p-4">
        <button className="bg-gray-600 hover:bg-gray-500 px-4 h-[40px] rounded-2xl cursor-pointer">
          Present Summary
        </button>
        <button className="bg-gray-600 hover:bg-gray-500  px-4 h-[40px] rounded-2xl cursor-pointer">
          Prepare Raffle
        </button>
      </div>
      {!isPresenting && (
        <div className="alert-div absolute bg-[#0000009d] w-full h-full grid place-items-center">
          <div className="modal-shell bg-white w-[300px] h-[200px] rounded-2xl flex flex-col justify-center items-center">
            <div className="modal-content text-black p-6 text-sm text-center flex flex-col justify-between h-full">
              <div className="top">
                <p className="mb-2">
                  You are about to open a new window for presentation
                </p>

                <p className="mb-2">Are you sure you want to proceed?</p>
              </div>
              <div className="bottom">
                <button
                  className="bg-[#a50e25] text-white p-2 px-4 rounded-2xl cursor-pointer hover:bg-[#7d0b1c]"
                  onClick={startPresentation}
                >
                  Start Presentation
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Tab_Overview;
