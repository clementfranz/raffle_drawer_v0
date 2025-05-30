import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { latestUpdateData } from "~/data/latestUpdateData";
import { NavLink } from "react-router";
import Tab03_SystemUpdates from "./SettingsModalTabs/Tab03_SystemUpdates";
import { useEffect, useState } from "react";
import Tab01_SystemUpdates from "./SettingsModalTabs/Tab03_SystemUpdates";
import Tab01_MyAccount from "./SettingsModalTabs/Tab01_MyAccount/main/Tab01_MyAccount";
import Tab04_AppStatus from "./SettingsModalTabs/Tab04_AppStatus";
import Tab05_Upgrades from "./SettingsModalTabs/Tab05_Upgrades";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const baseNavStyling =
  "nav-button pt-1.5 text-sm px-4 min-w-[100px] text-center";
const activeNavStyling = "bg-white text-black rounded-t-xl mb-0 pb-1.5";
const defaultNavStyling =
  "bg-transparent text-white pb-1.5 hover:bg-gray-800 rounded-xl mb-1 cursor-pointer";

type tabNames =
  | "system-updates"
  | "email-whitelist"
  | "my-account"
  | "app-status"
  | "upgrades";

const SettingsModal = ({ isOpen, onClose }: SettingsModalProps) => {
  const [activeTab, setActiveTab] = useState<tabNames>("my-account");

  const today = new Date();
  const revealNewTabsDate = new Date("2025-08-01T00:00:00");

  const [newTabsAvailable, setNewTabsAvailable] = useState(false);

  useEffect(() => {
    if (today >= revealNewTabsDate) {
      setNewTabsAvailable(true);
    } else {
      setNewTabsAvailable(false);
    }
  }, [revealNewTabsDate]);

  const isTabActive = (tabName: tabNames) => {
    if (activeTab === tabName) {
      return true;
    } else {
      return false;
    }
  };

  const handleChangeTab = (tabName: tabNames) => {
    if (tabName === activeTab) {
      return null;
    }
    setActiveTab(tabName);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "my-account":
        return <Tab01_MyAccount />;
      case "system-updates":
        return <Tab03_SystemUpdates />;
      case "app-status":
        return <Tab04_AppStatus />;
      case "upgrades":
        return <Tab05_Upgrades />;
      default:
        return null;
    }
  };

  useEffect(() => {
    // setActiveTab("system-updates");
  }, [isOpen]);

  if (!isOpen) return null; // no rendering when closed

  return (
    <div className="fixed inset-0 bg-[rgba(0,0,0,0.4)] z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg h-3/4 min-w-[850px] max-w-[900px] text-black flex flex-col relative transition-all duration-150">
        <div className="flex justify-between items-center">
          <div className="header-content flex-col flex bg-gradient-to-t from-[#000000a4] to-transparent to-60% w-full h-[80px] relative">
            <h1 className="flex flex-col pt-3 text-gray-800 text-xl uppercase font-bold font-[Montserrat] pl-4">
              Settings{" "}
            </h1>
            <nav className="absolute bottom-0 w-full px-4 flex gap-1">
              <button
                className={`${baseNavStyling} ${
                  isTabActive("my-account")
                    ? activeNavStyling
                    : defaultNavStyling
                }`}
                onClick={() => {
                  handleChangeTab("my-account");
                }}
              >
                My Account
              </button>
              <button
                className={`${baseNavStyling} ${
                  isTabActive("email-whitelist")
                    ? activeNavStyling
                    : defaultNavStyling
                }`}
                onClick={() => {
                  handleChangeTab("email-whitelist");
                }}
              >
                Email Whitelist
              </button>
              <button
                className={`${baseNavStyling} ${
                  isTabActive("system-updates")
                    ? activeNavStyling
                    : defaultNavStyling
                }`}
                onClick={() => {
                  handleChangeTab("system-updates");
                }}
              >
                System Updates
              </button>
              {newTabsAvailable && (
                <>
                  <button
                    className={`${baseNavStyling} ${
                      isTabActive("app-status")
                        ? activeNavStyling
                        : defaultNavStyling
                    }`}
                    onClick={() => {
                      handleChangeTab("app-status");
                    }}
                  >
                    App Status
                  </button>
                  <button
                    className={`${baseNavStyling} ${
                      isTabActive("upgrades")
                        ? activeNavStyling
                        : defaultNavStyling
                    }`}
                    onClick={() => {
                      handleChangeTab("upgrades");
                    }}
                  >
                    Upgrades
                  </button>
                </>
              )}
            </nav>
          </div>
          <button
            onClick={onClose}
            aria-label="Close Modal"
            className="exit-button h-[40px] aspect-square text-white font-bold bg-gray-800 rounded-full cursor-pointer hover:bg-gray-700 flex items-center justify-center transition-all duration-200 ease-in-out absolute top-4 right-4"
          >
            <FontAwesomeIcon icon={faXmark} className="text-2xl" />
          </button>
        </div>

        <div className="grow overflow-y-auto mt-4 px-4">
          {renderTabContent()}
        </div>

        <div className="modal-footer text-right text-sm mt-4 flex justify-between p-4">
          <div className="footer-content italic">
            Last System Update: {latestUpdateData}
          </div>
          {/* <NavLink to="/docs/software-license-agreement">
            See <span className="hover:underline text-blue-600">SLA</span>
          </NavLink> */}
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
