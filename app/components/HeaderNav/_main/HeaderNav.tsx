import React, { useState, useEffect } from "react";

interface HeaderNavProps {
  setIsPresenting?: React.Dispatch<React.SetStateAction<boolean>>;
  isPresenting?: boolean;
}

import SettingsButton from "~/components/HeaderNav/components/SettingsButton";
import LogoutButton from "../components/LogoutButton";
import { useAuth } from "~/auth/AuthContext";
import ProfileDropdown from "../components/ProfileDropdown";
import SettingsModal from "../components/SettingsModal";

const HeaderNav: React.FC<HeaderNavProps> = ({ isPresenting }) => {
  const { user } = useAuth();
  const [isPresentingMode, setIsPresentingMode] = useState(false);

  const [greetingActive, setGreetingActive] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(true);

  const toggleModal = () => setIsModalOpen((prev) => !prev);

  useEffect(() => {
    if (isPresenting) {
      setIsPresentingMode(true);
    } else {
      setIsPresentingMode(false);
    }
  }, [isPresenting]);

  useEffect(() => {
    setGreetingActive(true);

    const exitGreeting = setTimeout(() => {
      setGreetingActive(false);
      clearTimeout(exitGreeting);
    }, 10000);
  }, []);

  return (
    <>
      <header className=" h-[50px]">
        <div className="flex items-center justify-between px-4 py-2 h-full">
          <h1 className="flex gap-2 items-center">
            {" "}
            <span className="brand-name text-2xl font-bold">
              {" "}
              Kopiko Blanca
            </span>
            Raffle Draw System
          </h1>
          <nav>
            <ul className="flex space-x-1 justify-center items-center">
              <li>
                <SettingsModal isOpen={isModalOpen} onClose={toggleModal} />
              </li>
              <li
                className={`pr-2 transition-all duration-1000 ${
                  greetingActive ? "translate-y-0" : "-translate-y-[100px]"
                }`}
              >
                {user ? `Welcome Back, ${user.first_name}! 😊` : ""}
              </li>
              <li>
                <ProfileDropdown settingsToggleModal={toggleModal} />
              </li>
            </ul>
          </nav>
          {!isPresentingMode ? (
            <div className="center-div absolute left-1/2 -translate-x-1/2 bg-gray-800 h-[30px] flex items-center justify-center text-white opacity-50 rounded-xl py-2 px-4 select-none">
              No Presentation
            </div>
          ) : (
            <div className="center-div absolute left-1/2 -translate-x-1/2 bg-[#03813c] h-[30px] flex items-center justify-center text-white rounded-xl py-2 px-4 select-none animate-pulse">
              Presenting...
            </div>
          )}
        </div>
      </header>
    </>
  );
};

export default HeaderNav;
