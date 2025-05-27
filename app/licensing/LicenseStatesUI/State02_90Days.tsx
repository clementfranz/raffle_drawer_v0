import React, { useEffect, useState } from "react";
import { checkDaysBeforeLicenseExpiration } from "../licenseValidator";
import "./State02_90Days.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock, faClose } from "@fortawesome/free-solid-svg-icons";
import useLocalStorageState from "use-local-storage-state";

const WAITING_PERIOD_MS = 24 * 60 * 60 * 1000; // 24 hours
const CHECK_INTERVAL_MS = 5 * 60 * 1000; // 5 minutes

const State02_90Days = () => {
  const remainingDays = checkDaysBeforeLicenseExpiration();

  const [isBannerVisible, setIsBannerVisible] = useState(false);

  const [lastBannerClosed, setLastBannerClosed] = useLocalStorageState<
    number | null
  >("lastBannerClosed", {
    defaultValue: null
  });

  const handleCloseBanner = () => {
    const now = Date.now();
    setLastBannerClosed(now);
    setIsBannerVisible(false);
  };

  const handleReadLicense = () => {
    window.open(
      "/docs/software-license-agreement?highlight=section-13",
      "_blank"
    );
  };

  const showBannerCheck = (lastClosed: number | null) => {
    const now = Date.now();
    if (lastClosed === null || now - lastClosed >= WAITING_PERIOD_MS) {
      setIsBannerVisible(true);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      showBannerCheck(lastBannerClosed);
    }, CHECK_INTERVAL_MS);

    return () => clearInterval(interval);
  }, [lastBannerClosed]);

  useEffect(() => {
    const slideInBanner = setTimeout(() => {
      showBannerCheck(lastBannerClosed);
      clearTimeout(slideInBanner);
    }, 10000);
  }, []);

  return (
    <div
      className={`absolute top-0  left-1/2 -translate-x-1/2  flex justify-center z-[80] transition-all duration-700 ${
        isBannerVisible
          ? "translate-y-0 opacity-100"
          : "-translate-y-full opacity-0"
      }`}
    >
      <div className="shell bg-white h-[60px] rounded-b-3xl px-8 warning-banner min-w-[70vw]">
        <div className="content flex gap-4 items-center h-full justify-center w-full">
          <div className="header">License Expiration Warning</div>
          <div className="message grow">
            Your license for this software will expire in {remainingDays} days.{" "}
          </div>
          <button
            className="learn-more bg-[#000000b9] hover:bg-[#ffffff73] p-2 px-4 cursor-pointer rounded-xl text-sm"
            onClick={handleReadLicense}
          >
            Read License
          </button>
          <button
            className="close bg-[#000000b9] p-2 px-4  cursor-pointer hover:bg-[#ffffff50] text-sm rounded-xl"
            aria-label="close"
            onClick={handleCloseBanner}
          >
            {/* <FontAwesomeIcon icon={faClose} /> */}
            Remind Me Later
          </button>
        </div>
      </div>
    </div>
  );
};

export default State02_90Days;
