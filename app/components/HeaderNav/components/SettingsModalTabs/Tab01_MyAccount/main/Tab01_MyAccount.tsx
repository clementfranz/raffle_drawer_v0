import React from "react";
import { useAuth } from "~/auth/AuthContext";
import AnonymousPic from "~/assets/profile-pictures/anonymous.svg";
import Section_ChangePassword from "../subcomponents/Section_ChangePassword";

const Tab01_MyAccount = () => {
  const { user } = useAuth();
  return (
    <div className="grow flex flex-col gap-3 relative h-full">
      <span className="text-2xl font-bold">My Account</span>
      <div className="body grow flex h-full gap-4">
        <div className="py-4  px-4 rounded-2xl profile-box text-white bg-gray-600 w-2/5 h-full flex items-center justify-center gap-3 flex-col">
          <div className="profile-pic">
            <img
              src={user?.picture ? user.picture : AnonymousPic}
              className="img-fluid rounded-full h-[150px]"
              alt=""
            />
          </div>
          <div className="full-name text-center">
            <div className="first-name text-xl">{user?.first_name}</div>
            <div className="last-name">{user?.last_name}</div>
          </div>
          <div className="user-email text-sm">{user?.email}</div>
        </div>
        <div className="other-settings grow bg-gray-300 rounded-2xl flex flex-col overflow-hidden">
          <h1 className="text-lg font-semibold px-4 pt-4 pb-2">
            Account Settings
          </h1>
          <div className="content-shell grow  h-0 overflow-y-auto">
            <div className="content-wrapper w-full  flex flex-col relative">
              <Section_ChangePassword />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tab01_MyAccount;
