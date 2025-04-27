import React, { useState } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsis } from "@fortawesome/free-solid-svg-icons";

const PaginationSettings = () => {
  const [paginationSettingsOpen, setPaginationSettingsOpen] = useState(false);
  return (
    <>
      <div className="pagination-settings h-full relative ">
        <span className="pagination-settings-button  text-base">
          <FontAwesomeIcon icon={faEllipsis} />
        </span>
        <div className="bg-orange-100 h-[80px] w-[150px] items-center justify-center px-2 flex absolute top-0 left-1/2 z-40 -translate-y-[calc(100%_-_10px)] -translate-x-1/2 rounded-lg">
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
