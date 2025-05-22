import React, { useState } from "react";
import { useAuth } from "~/auth/AuthContext";
import AnonymousSVG from "~/assets/profile-pictures/anonymous.svg";
import SettingsButton from "~/components/HeaderNav/components/SettingsButton";
import LogoutButton from "./LogoutButton";
import { NavLink } from "react-router";

type ProfileDropdownProps = {
  settingsToggleModal: () => void;
};

const ProfileDropdown = ({ settingsToggleModal }: ProfileDropdownProps) => {
  const { user } = useAuth();

  const [dropdownActive, setDropdownActive] = useState(false);

  const handleToggleDropdown = () => {
    setDropdownActive((prev) => {
      return !prev;
    });
  };

  return (
    <div className="relative">
      <button
        type="button"
        className={`flex gap-2 justify-center items-center hover:bg-gray-800 p-1.5   hover:text-white cursor-pointer transition-all duration-200 ${
          dropdownActive
            ? "rounded-b-none rounded-t-[18px] bg-gray-950 text-white text-sm"
            : "bg-white text-red-800 rounded-[18px]"
        }`}
        onClick={handleToggleDropdown}
      >
        <img
          src={user?.picture ? user.picture : AnonymousSVG}
          alt="User avatar"
          height={25} // or width={48}
          className="rounded-full bg-blue-800 overflow-hidden text-xs aspect-square h-[25px]"
        />
        <span className="pr-1.5">
          {user?.first_name + " " + user?.last_name[0] + "."}
        </span>
      </button>
      {dropdownActive && (
        <div className="dropdown absolute bottom-0 z-[40] translate-y-full bg-gray-950 rounded-2xl min-w-[250px] flex justify-center p-2 flex-col right-0 rounded-tr-none">
          <div className="profile-details w-full justify-center flex items-center py-2 mb-2 bg-gray-800 rounded-xl">
            <div className="name text-xl">
              {user?.first_name + " " + user?.last_name[0] + "."}
            </div>
          </div>
          <SettingsButton onClick={settingsToggleModal} />
          <LogoutButton />
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;
