import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight
} from "@fortawesome/free-solid-svg-icons";

import useLocalStorageState from "use-local-storage-state";
import PaginationSettings from "../PaginationSettings/PaginationSettings";

const PaginationBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [lastPage, setLastPage] = useState(1);

  interface FileDetails {
    entries: number;
  }

  const [fileDetails] = useLocalStorageState<FileDetails | null>("fileDetails");

  const goToPage = (page: number) => {
    if (page < 1 || page > lastPage) return;
    params.set("page", page.toString());
    params.set("pageSize", pageSize.toString());
    navigate({ search: params.toString() });
  };

  useEffect(() => {
    const page = parseInt(params.get("page") || "1", 10);
    const size = parseInt(params.get("pageSize") || "10", 10);
    setCurrentPage(page);
    setPageSize(size);

    if (fileDetails) {
      const calculatedLastPage = Math.ceil(fileDetails.entries / size);
      setLastPage(calculatedLastPage);
    } else {
      setLastPage(1);
    }
  }, [params, fileDetails]);

  const generatePageNumbers = () => {
    const pages = [];

    if (lastPage <= 7) {
      // Show all pages if total is 7 or less
      for (let i = 1; i <= lastPage; i++) {
        pages.push(i);
      }
    } else {
      // More than 7 pages, so use standard logic
      if (currentPage <= 4) {
        pages.push(1, 2, 3, 4, 5, "...", lastPage);
      } else if (currentPage >= lastPage - 3) {
        pages.push(
          1,
          "...",
          lastPage - 4,
          lastPage - 3,
          lastPage - 2,
          lastPage - 1,
          lastPage
        );
      } else {
        pages.push(
          1,
          "...",
          currentPage - 1,
          currentPage,
          currentPage + 1,
          "...",
          lastPage
        );
      }
    }

    return pages;
  };

  return (
    <div className="pagination bg-orange-200 rounded-full text-xs flex flex-row items-center h-[40px]">
      <button
        className="hover:bg-orange-300 px-2 ps-3 h-[40px] rounded-r-lg cursor-pointer text-sm aspect-square overflow-hidden rounded-l-full"
        aria-label="Previous Page"
        onClick={() => goToPage(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <FontAwesomeIcon icon={faChevronLeft} />
      </button>

      <div className="pages flex flex-row items-center px-2">
        {generatePageNumbers().map((page, index) =>
          page === "..." ? (
            <span key={index} className="px-2 select-none">
              ...
            </span>
          ) : (
            <span
              key={index}
              className={`cursor-pointer px-2 ${
                currentPage === page ? "active font-bold" : ""
              }`}
              onClick={() => goToPage(Number(page))}
            >
              {page}
            </span>
          )
        )}
        <PaginationSettings />
      </div>

      <button
        type="button"
        className="hover:bg-orange-300 px-2 pe-3 h-[40px] rounded-l-lg cursor-pointer text-sm aspect-square overflow-hidden rounded-r-full"
        aria-label="Next Page"
        onClick={() => goToPage(currentPage + 1)}
        disabled={currentPage === lastPage}
      >
        <FontAwesomeIcon icon={faChevronRight} />
      </button>
    </div>
  );
};

export default PaginationBar;
