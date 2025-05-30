import React, { useEffect } from "react";
import { NavLink, useNavigate } from "react-router";
import useLocalStorageState from "use-local-storage-state";
import { logUserAction } from "~/api/asClient/system/logUserAction";
import { useAuth } from "~/auth/AuthContext";

const DependencyWarning = () => {
  const [dependencyWarningActive, setDependencyWarningActive] =
    useLocalStorageState<boolean>("dependencyWarningActive", {
      defaultValue: false
    });

  const [localIllegitimateDate] = useLocalStorageState(
    "nrds_illegitimate_date",
    {
      defaultValue: false
    }
  );
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/"); // Redirect to home or login page
    logUserAction(user?.email || "user@noemail.com", "logout", {
      source: "Logout",
      result: "success"
    });
  };

  useEffect(() => {
    const today = new Date();
    const warningDate = new Date("2025-08-15");

    if (today >= warningDate) {
      setDependencyWarningActive(true);
    } else {
      setDependencyWarningActive(false);
    }
  }, []);

  return (
    <>
      {dependencyWarningActive && !localIllegitimateDate && (
        <div className="absolute z-[50] flex justify-center items-start h-screen w-screen select-none">
          <div className="bg-white/60 rounded-b-2xl shadow-2xl  p-6 text-center space-y-4 animate-fade-in backdrop-blur-xs w-[80vw] flex flex-col">
            <div className="header flex gap-5 items-center">
              <div className="text-red-600 text-4xl">⚠️</div>
              <h2 className="text-2xl font-bold text-red-800 uppercase">
                Critical Dependency Warning
              </h2>
            </div>
            <div className="content flex justify-between gap-5">
              <p className="text-gray-800 text-base text-balance font-semibold">
                This version of the software may no longer work as intended due
                to browser updates or outdated dependencies. Please contact the
                developer or update to the latest supported version.
              </p>
            </div>
            <div className="flex w-full justify-between">
              <div className="flex gap-4">
                <NavLink
                  to={"/docs/software-license-agreement-v1"}
                  target="_blank"
                >
                  <button className="px-4 py-2 bg-red-900 hover:bg-red-800 text-white  rounded-lg shadow cursor-pointer w-full">
                    Read Software License
                  </button>
                </NavLink>
                <NavLink
                  to={
                    "https://clients.clementfranz.site/portal?c=kopikoblanca&key=aZ9B-q3Xr-MtL2-GVn7-KfWp"
                  }
                  target="_blank"
                >
                  <button className="px-4 py-2 bg-red-800 hover:bg-red-700 text-white font-semibold rounded-lg shadow cursor-pointer w-full">
                    Contact Developer
                  </button>
                </NavLink>
              </div>
              <div>
                <button
                  className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white  rounded-lg shadow cursor-pointer w-full"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
          <div className="absolute h-screen w-screen bg-gradient-to-t to-45% from-red-900/60 to-red-950/30 z-[-1]"></div>
        </div>
      )}
    </>
  );
};

export default DependencyWarning;
