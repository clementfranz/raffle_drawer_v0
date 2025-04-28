import React, { useState } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsis } from "@fortawesome/free-solid-svg-icons";

const PaginationSettings = () => {
  const [paginationSettingsOpen, setPaginationSettingsOpen] = useState(false);

  const togglePaginationSettings = () => {
    setPaginationSettingsOpen((prev) => !prev);
  };

  return (
    <>
      <div className="pagination-settings h-full relative flex items-center justify-center">
        <button
          type="button"
          className="pagination-settings-button text-base cursor-pointer flex items-center justify-center w-[30px] h-[30px] rounded-full bg-orange-200 hover:bg-orange-300 active:bg-orange-400 transition-all duration-200 ease-in-out"
          aria-label="Pagination Settings"
          onClick={togglePaginationSettings}
        >
          <FontAwesomeIcon icon={faEllipsis} />
        </button>
        <div
          className={`bg-orange-800 text-white h-[80px] w-[150px] items-center justify-center px-2  absolute top-0 left-1/2 z-40 -translate-y-[calc(100%_-_10px)] -translate-x-1/2 rounded-lg ${
            paginationSettingsOpen ? "flex" : "hidden"
          }`}
        >
          Go to page{" "}
          <input
            className="ml-2 bg-white w-[30px] h-[20px] rounded-lg text-black text-center"
            type="text"
            aria-label="Page Number"
            defaultValue="1"
          />
        </div>
      </div>
    </>
  );
};

export default PaginationSettings;
