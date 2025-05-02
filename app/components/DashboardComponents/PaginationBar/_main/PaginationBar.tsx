import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight
} from "@fortawesome/free-solid-svg-icons";

import PaginationSettings from "../PaginationSettings/PaginationSettings";
import useLocalStorageState from "use-local-storage-state";

const PaginationBar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const params = new URLSearchParams(location.search);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(250);
  const [lastPage, setLastPage] = useState(10);

  interface FileDetails {
    entries: number;
  }

  const [fileDetails, setFileDetails] =
    useLocalStorageState<FileDetails | null>("fileDetails");

  const goToPage = (page: number) => {
    params.set("page", page.toString());
    params.set("pageSize", pageSize.toString()); // keep pageSize
    navigate({ search: params.toString() });
  };
  useEffect(() => {
    const updatePagination = () => {
      const page = parseInt(params.get("page") || "1", 10);
      const size = parseInt(params.get("pageSize") || "250", 10);
      setCurrentPage(page);
      setPageSize(size);
    };

    updatePagination();

    if (fileDetails) {
      const lastPageCalculated = Math.ceil(fileDetails.entries / pageSize);
      setLastPage(lastPageCalculated);
    } else {
      setLastPage(10); // Default value if fileDetails is null
    }
  }, [params, fileDetails, pageSize]);

  return (
    <div className="pagination bg-orange-200 rounded-full text-xs flex flex-row  items-center  h-[40px]">
      <button
        className=" hover:bg-orange-300 px-2 ps-3 h-[40px] rounded-r-lg cursor-pointer text-sm aspect-square overflow-hidden rounded-l-full"
        aria-label="Previous Page"
        onClick={() => goToPage(currentPage - 1)}
      >
        <FontAwesomeIcon icon={faChevronLeft} />
      </button>
      <div className="pages">
        {currentPage > 3 ? (
          <>
            <span className="" onClick={() => goToPage(currentPage - 3)}>
              {currentPage - 3}
            </span>
            <span className="" onClick={() => goToPage(currentPage - 2)}>
              {currentPage - 2}
            </span>
            <span className="" onClick={() => goToPage(currentPage - 1)}>
              {currentPage - 1}
            </span>
            <span className=" active" onClick={() => goToPage(currentPage)}>
              {currentPage}
            </span>
          </>
        ) : (
          <>
            <span className=" active" onClick={() => goToPage(currentPage)}>
              {currentPage}
            </span>
            <span className="" onClick={() => goToPage(currentPage + 1)}>
              {currentPage + 1}
            </span>
            <span className="" onClick={() => goToPage(currentPage + 2)}>
              {currentPage + 2}
            </span>
            <span className="" onClick={() => goToPage(currentPage + 3)}>
              {currentPage + 3}
            </span>
          </>
        )}
        <PaginationSettings />

        <span className="" onClick={() => goToPage(lastPage - 2)}>
          {lastPage - 2}
        </span>
        <span className="" onClick={() => goToPage(lastPage - 1)}>
          {lastPage - 1}
        </span>
        <span className="" onClick={() => goToPage(lastPage)}>
          {lastPage}
        </span>
      </div>
      <button
        type="button"
        className=" hover:bg-orange-300 px-2 pe-3 h-[40px] rounded-l-lg cursor-pointer text-sm aspect-square overflow-hidden rounded-r-full"
        aria-label="Next Page"
        onClick={() => goToPage(currentPage + 1)}
      >
        <FontAwesomeIcon icon={faChevronRight} />
      </button>
    </div>
  );
};

export default PaginationBar;
