import React, { useEffect, useState } from "react";
import {
  checkDaysBeforeLicenseExpiration,
  getLicenseExpirationDate
} from "../licenseValidator";
import { useLocation } from "react-router";
import { useCountdown } from "~/hooks/useCountdown";

const State03_30Days = () => {
  const remainingDays = checkDaysBeforeLicenseExpiration();
  const expiration = getLicenseExpirationDate();

  const { days, hours, minutes, seconds } = useCountdown(expiration);

  const [openDropdown, setOpenDropdown] = useState(false);

  const [countdownLabel, setCountdownLabel] = useState(`${remainingDays} days`);

  const location = useLocation();
  const pageRoute = location.pathname;

  const handleToggleDropdown = () => {
    if (openDropdown) {
      setOpenDropdown(false);
    } else {
      setOpenDropdown(true);
    }
  };

  const handleCloseDropdown = () => {
    setOpenDropdown(false);
  };

  const handleReadLicense = () => {
    window.open(
      "/docs/software-license-agreement?highlight=section-13",
      "_blank"
    );
  };

  useEffect(() => {
    let label: string;
    if (days >= 7) {
      label = `${days} days`;
    } else {
      const d = days > 0 ? `${days}d, ` : "";
      const h = hours > 0 ? `${hours}h, ` : "";
      const m = minutes > 0 ? `${minutes}m, ` : "";
      const s = `${seconds}s`;

      label = `${d}${h}${m}${s}`;
    }

    setCountdownLabel(label);
  }, [days, hours, minutes, seconds]);

  if (pageRoute === "/presenter") return null;

  return (
    <div className="absolute left-1/2 -translate-x-[calc(100%_+_100px)] flex flex-col z-[80]">
      <div className="license-notifier warning-banner translucent h-[60px] px-4 flex justify-center items-center rounded-b-2xl">
        <button
          className=" cursor-pointer p-2 px-4 rounded-xl text-sm hover:bg-[#000000bb] hover:text-white border-solid border-1 border-white hover:border-transparent text-black bg-[#ffffff93]"
          onClick={handleToggleDropdown}
        >
          License will expire in {countdownLabel}
        </button>
      </div>
      <div
        className={`dropdown-buttons bg-[#041730ea] -translate-y-[4px] w-[80%] mx-auto p-4 text-white rounded-xl overflow-hidden ${
          openDropdown ? "flex" : "hidden"
        }`}
      >
        <div className="dropdown-contents flex flex-col gap-3 text-sm w-full">
          <button
            className="cursor-pointer border-solid border-1 border-white hover:border-transparent hover:bg-[#ffffff9f] hover:text-black text-center w-full p-2 rounded-xl"
            onClick={handleReadLicense}
          >
            Read License
          </button>
          <button className="cursor-pointer border-solid border-1 border-white hover:border-transparent hover:bg-[#ffffff9f] hover:text-black text-center w-full p-2 rounded-xl">
            Renew License
          </button>
          <button
            className="cursor-pointer border-solid border-1 border-white hover:border-transparent hover:bg-[#ffffff9f] hover:text-black text-center w-full p-2 rounded-xl"
            onClick={handleCloseDropdown}
          >
            Close Menu
          </button>
        </div>
      </div>
    </div>
  );
};

export default State03_30Days;
