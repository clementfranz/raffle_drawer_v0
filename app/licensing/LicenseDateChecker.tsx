import React, { useEffect, useState } from "react";
import { useLocation } from "react-router";
import {
  checkDaysBeforeLicenseExpiration,
  getLicenseExpirationDate
} from "./licenseValidator";
import State01_Valid from "./LicenseStatesUI/State01_Valid";
import State02_90Days from "./LicenseStatesUI/State02_90Days";
import State03_30Days from "./LicenseStatesUI/State03_30Days";
import State05_Expired from "./LicenseStatesUI/State05_Expired";
import State04_7Days from "./LicenseStatesUI/State04_7Days";
import { useCountdown } from "~/hooks/useCountdown";

type LicenseStates = "valid" | "90-days" | "30-days" | "7-days" | "expired";

const LicenseDateChecker = () => {
  const [daysBeforeExpiry, setDaysBeforeExpiry] = useState(365);
  const [checkedExpiration, setCheckedExpiration] = useState(false);
  const [licenseStatus, setLicenseStatus] = useState<LicenseStates>("valid");

  const location = useLocation();
  const pageRoute = location.pathname;

  const expiration = getLicenseExpirationDate();
  const { days, hours, minutes, seconds } = useCountdown(expiration);

  const renderStateUI = (licenseState: LicenseStates) => {
    switch (licenseState) {
      case "valid":
        return <State01_Valid />;
      case "90-days":
        return <State02_90Days />;
      case "30-days":
        return <State03_30Days />;
      case "7-days":
        return (
          <>
            <State03_30Days />
            <State04_7Days />
          </>
        ); // TODO: Replace with actual 7-day warning component
      default:
        if (days + hours + minutes + seconds > 0) {
          return (
            <>
              <State03_30Days />
              <State04_7Days />
            </>
          );
        } else {
          return <State05_Expired />;
        }
    }
  };

  useEffect(() => {
    if (daysBeforeExpiry > 90) {
      setLicenseStatus("valid");
    } else if (daysBeforeExpiry > 30) {
      setLicenseStatus("90-days");
    } else if (daysBeforeExpiry > 7) {
      setLicenseStatus("30-days");
    } else if (daysBeforeExpiry > 0) {
      setLicenseStatus("7-days");
    } else {
      setLicenseStatus("expired");
    }
  }, [daysBeforeExpiry]);

  useEffect(() => {
    if (!checkedExpiration) {
      const remainingDays = checkDaysBeforeLicenseExpiration();
      setDaysBeforeExpiry(remainingDays);
      setCheckedExpiration(true);
    }
  }, [checkedExpiration]);

  // ✅ Skip license warnings on "/presenter" route
  if (pageRoute === "/presenter" && daysBeforeExpiry > 7) return null;

  return (
    <>
      {checkedExpiration && (
        <>
          <span className="uppercase hidden">
            License Status: {licenseStatus}
          </span>
          {renderStateUI(licenseStatus)}
        </>
      )}
    </>
  );
};

export default LicenseDateChecker;
