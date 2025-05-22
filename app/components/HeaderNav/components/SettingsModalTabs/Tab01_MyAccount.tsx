import React from "react";
import { useAuth } from "~/auth/AuthContext";
import AnonymousPic from "~/assets/profile-pictures/anonymous.svg";

const Tab01_MyAccount = () => {
  const { user } = useAuth();
  return (
    <div>
      <span className="text-2xl font-bold">My Account</span>
      <div className="py-4  px-4 rounded-2xl profile-box text-white bg-gray-700 w-fit flex items-center gap-3 mt-5">
        <div className="profile-pic">
          <img
            src={user?.picture ? user.picture : AnonymousPic}
            className="img-fluid rounded-full h-[50px]"
            alt=""
          />
        </div>
        <div className="full-name text-4xl">
          {user?.first_name + " " + user?.last_name}
        </div>
      </div>
    </div>
  );
};

export default Tab01_MyAccount;
