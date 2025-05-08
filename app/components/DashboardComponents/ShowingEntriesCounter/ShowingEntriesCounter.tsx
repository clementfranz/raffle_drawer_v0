import React, { useEffect, useState } from "react";
import { useLocation } from "react-router";
import useLocalStorageState from "use-local-storage-state";

const ShowingEntriesCounter = () => {
  const location = useLocation();

  const [totalEntries, setTotalEntries] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(250);
  const [fromNth, setFromNth] = useState(1);
  const [toNth, setToNth] = useState(250);

  const [withParticipantsData] = useLocalStorageState("withParticipantsData", {
    defaultValue: false
  });

  const getPageNumberAndSize = () => {
    const params = new URLSearchParams(location.search);
    const page = parseInt(params.get("page") || "1", 10);
    const size = parseInt(params.get("pageSize") || "250", 10);
    return { page, size };
  };

  const setFromAndToNth = () => {
    if (totalEntries > pageSize * pageNumber) {
      setToNth(pageSize * pageNumber);
    } else {
      setToNth(totalEntries);
    }
    if (pageNumber === 1) {
      setFromNth(1);
      setToNth(250);
    } else {
      setFromNth((pageNumber - 1) * pageSize + 1);
    }
  };

  useEffect(() => {
    const { page, size } = getPageNumberAndSize();
    setPageNumber(page);
    setPageSize(size);
  }, [location.search]);

  useEffect(() => {
    setFromAndToNth();
  }, [pageNumber, pageSize]);

  interface FileDetails {
    entries: number;
  }

  const [fileDetails] = useLocalStorageState<FileDetails | null>("fileDetails");

  useEffect(() => {
    if (fileDetails) {
      setTotalEntries(fileDetails?.entries);
    }
    const { page, size } = getPageNumberAndSize();
    setPageNumber(page);
    setPageSize(size);
  }, [fileDetails]);

  useEffect(() => {
    if (fileDetails) {
      setTotalEntries(fileDetails?.entries);
    }
    const { page, size } = getPageNumberAndSize();
    setPageNumber(page);
    setPageSize(size);
  }, []);

  return (
    <>
      <div
        className={`text-sm  items-center gap-2 ${
          withParticipantsData ? "flex" : "hidden"
        }`}
      >
        Showing Entries:&nbsp;
        <b className="flex gap-2 items-baseline justify-center">
          From{" "}
          <span className="bg-gray-700 min-w-[40px] flex  text-white p-2 py-1 rounded-md justify-center">
            {fromNth.toLocaleString()}
          </span>{" "}
          to{" "}
          <span className="bg-gray-700 min-w-[40px] flex  text-white p-2 py-1 rounded-md justify-center">
            {toNth.toLocaleString()}
          </span>{" "}
        </b>
      </div>
    </>
  );
};

export default ShowingEntriesCounter;
