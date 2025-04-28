import React, { useState, useEffect } from "react";

interface HeaderNavProps {
  setIsPresenting?: React.Dispatch<React.SetStateAction<boolean>>;
  isPresenting?: boolean;
}

import SettingsButton from "~/components/SettingsButton";

const HeaderNav: React.FC<HeaderNavProps> = ({ isPresenting }) => {
  const [isPresentingMode, setIsPresentingMode] = useState(false);

  useEffect(() => {
    if (isPresenting) {
      setIsPresentingMode(true);
    } else {
      setIsPresentingMode(false);
    }
  }, [isPresenting]);

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
            Raffle System
          </h1>
          <nav>
            <ul className="flex space-x-1 justify-center items-center">
              <li>
                <SettingsButton />
              </li>
              <li>
                <a
                  href="/logout"
                  className="px-4 py-2 hover:bg-[#7d0b1c] rounded-full"
                >
                  Logout
                </a>
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
