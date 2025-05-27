import React, { useEffect } from "react";
import useLocalStorageState from "use-local-storage-state";

const State01_Valid = () => {
  const [validLicenseLogged, setValidLicenseLogged] = useLocalStorageState(
    "validLicenseLogged",
    { defaultValue: false }
  );

  useEffect(() => {
    console.log("License is still valid until May 25, 2026");
    if (!validLicenseLogged) {
      setValidLicenseLogged(true);
    }
  }, []);

  return (
    <div className="hidden">License is still valid until May 25, 2026</div>
  );
};

export default State01_Valid;
