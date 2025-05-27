import React, { useEffect, useState } from "react";
import { useLocation } from "react-router";
import { checkDaysBeforeLicenseExpiration } from "../licenseValidator";
import useLocalStorageState from "use-local-storage-state";

const State04_7Days = () => {
  const remainingDays = checkDaysBeforeLicenseExpiration();

  const remainingDaysLabel = () => {
    if (remainingDays > 1) {
      return " in " + remainingDays + " days";
    } else if (remainingDays === 1) {
      return "tomorrow";
    } else {
      return "later";
    }
  };

  const location = useLocation();
  const pageRoute = location.pathname;

  const [presenterBannerCooldown, setPresenterBannerCooldown] = useState(false);

  const [presentingView, setPresentingView] = useLocalStorageState(
    "presentingView",
    {
      defaultValue: "intro"
    }
  );

  const highlightBanner = () => {
    setPresenterBannerCooldown(false);
    const coolDownTimer = setTimeout(() => {
      setPresenterBannerCooldown(true);
      clearTimeout(coolDownTimer);
    }, 10000);
  };

  useEffect(() => {
    highlightBanner();
  }, [presentingView]);

  useEffect(() => {
    highlightBanner();
  }, []);

  if (pageRoute === "/presenter")
    return (
      <>
        <div
          className={`absolute bottom-0 left-0 z-[100] transition-all duration-[2s] ${
            presenterBannerCooldown
              ? "opacity-15 w-[450px]"
              : "opacity-60 w-[100vw]"
          }`}
        >
          <div
            className={`shell  transition-all duration-[2s] text-center w-full ${
              presenterBannerCooldown
                ? "p-2 rounded-tr-2xl   bg-[#ffffffad]"
                : "p-4  rounded-none bg-[#f5f534bb]"
            }`}
          >
            License Expiring. System will be disabled {remainingDaysLabel()}.
          </div>
        </div>
      </>
    );
  return (
    <div className="view-main absolute z-[85] bg-[#4e0808c7] w-screen h-screen overflow-hidden hidden">
      State04_7Days
    </div>
  );
};

export default State04_7Days;
