import React, { useEffect, useState } from "react";

const Tab04_AppStatus = () => {
  const [isOnline, setIsOnline] = useState<boolean | null>(null);

  const clientAppStatusURL =
    "https://clients.clementfranz.site/iframe/appstatus?c=kopikoblanca&key=aZ9B-q3Xr-MtL2-GVn7-KfWp&bg=#ffffff";

  useEffect(() => {
    const checkURL = async () => {
      try {
        const response = await fetch(clientAppStatusURL, {
          method: "HEAD",
          mode: "no-cors" // or 'cors' depending on CORS config
        });
        // If we get here, server is reachable (even if response is opaque)
        setIsOnline(true);
      } catch (err) {
        console.error("URL unreachable:", err);
        setIsOnline(false);
      }
    };

    checkURL();
  }, []);

  if (isOnline === null) {
    return (
      <div className="w-full h-full flex items-center justify-center text-gray-600">
        🔄 Checking app status...
      </div>
    );
  }

  if (!isOnline) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center text-red-600">
        <p className="text-lg font-semibold">🚫 App is currently offline</p>
        <p className="text-sm text-gray-500 mt-1">
          Please check your internet connection or try again later.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full h-full">
      <iframe
        src={clientAppStatusURL}
        className="w-full h-full border-0"
        title="remote-app-status"
      ></iframe>
    </div>
  );
};

export default Tab04_AppStatus;
