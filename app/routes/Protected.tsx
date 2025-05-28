import { Navigate, Outlet } from "react-router";
import { useAuth } from "../auth/AuthContext";
import LicenseDateChecker from "~/licensing/LicenseDateChecker";
import DefaultLoader from "~/components/Loaders/DefaultLoader/DefaultLoader";
import { useEffect, useRef, useState } from "react";
import useLocalStorageState from "use-local-storage-state";
import {
  checkDaysBeforeLicenseExpiration,
  getLicenseExpirationDate
} from "~/licensing/licenseValidator";
import BGLicenseExpired from "~/licensing/LicenseStatesUI/BGLicenseExpired";
import { useCountdown } from "~/hooks/useCountdown";
import DateLegitimator from "~/components/DateLegitimator/_main/DateLegitimator";
import BGSystemDateAnomaly from "~/components/DateLegitimator/subcomponents/BGSystemDateAnomaly";
import BGOfflineServer from "~/components/CloudSyncer/components/BGOfflineServer";

export default function Protected() {
  const remainingDays = checkDaysBeforeLicenseExpiration();
  const expiration = getLicenseExpirationDate();

  const [isServerActive, setIsServerActive] = useLocalStorageState<boolean>(
    "isServerActive",
    { defaultValue: true }
  );

  const [localIllegitimateDate, setLocalIllegitimateDate] =
    useLocalStorageState("nrds_illegitimate_date", {
      defaultValue: false
    });

  const { days, hours, minutes, seconds } = useCountdown(expiration);

  const { user, loading } = useAuth();
  const [fadeOutLoader, setFadeOutLoader] = useState(false);
  const [waitingDone, setWaitingDone] = useState(false);

  const [isExpired, setIsExpired] = useState(false);

  const hasStarted = useRef(false); // ✅ Stable across re-renders

  useEffect(() => {
    if (!loading && !hasStarted.current && user) {
      hasStarted.current = true;
      const fadeTimer = setTimeout(() => {
        setFadeOutLoader(true);
        clearTimeout(fadeTimer);
      }, 1500);

      const doneTimer = setTimeout(() => {
        setWaitingDone(true);
        clearTimeout(doneTimer);
      }, 2000);
    }
  }, [loading, user]);

  useEffect(() => {
    const sum = days + hours + minutes + seconds;
    if (sum === 0 && !isExpired) {
      console.log("Setting expiration");
      setIsExpired(true);
    }
  }, [days, hours, minutes, seconds]);

  useEffect(() => {
    setWaitingDone(false);
  }, []);

  if (!user && !loading) {
    return <Navigate to="/" replace />;
  }

  return (
    <>
      {!waitingDone && (
        <div
          className={`transition-all duration-500 fixed top-0 left-0 w-screen h-screen z-[100] bg-white flex items-center justify-center overflow-hidden ${
            fadeOutLoader ? "opacity-0" : "opacity-100"
          }`}
        >
          <DefaultLoader />
        </div>
      )}

      {/* Main content appears regardless of loader, but loader blocks view */}
      <DateLegitimator />
      <LicenseDateChecker />
      {isExpired ? (
        <BGLicenseExpired />
      ) : localIllegitimateDate ? (
        <BGSystemDateAnomaly />
      ) : !isServerActive ? (
        <BGOfflineServer />
      ) : (
        <Outlet />
      )}
    </>
  );
}
