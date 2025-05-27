import React from "react";

import "./State05_Expired.css";
import { useNavigate } from "react-router";
import { useAuth } from "~/auth/AuthContext";

const State05_Expired = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/"); // Redirect to home or login page
  };

  const handleReadLicense = () => {
    window.open(
      "/docs/software-license-agreement?highlight=section-13",
      "_blank"
    );
  };

  return (
    <>
      <div
        className={`absolute h-screen w-screen bg-[#8d0000a6] z-[80] justify-center items-`}
      >
        <div className="visible-block bg-[#000000c0] flex gap-3 z-[81] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white p-8 rounded-4xl flex-col ">
          <div className="shell flex flex-col w-full">
            <div className="title-wrapper bg-[#00000080] py-8 rounded-3xl">
              <div className="title-contents text-center font-[Montserrat] text-5xl font-bold red-alert-animation uppercase flex flex-col gap-2">
                <span>System Disabled</span>
                <span>License Expired</span>
              </div>
            </div>
            <div className="message my-5 mt-10">
              <p>
                The license for this software expired on{" "}
                <strong>May 25, 2026</strong>. You can still log in, but all
                features have been disabled and are no longer accessible.
              </p>
              <p className="mt-4">
                To regain access, you may <strong>renew your license</strong> or
                choose to <strong>purchase the entire system</strong> with
                exclusive rights, which includes upgraded premium features and
                future enhancements.
              </p>
              <p className="mt-4">
                For more details, please contact the developer or click the{" "}
                <strong>"Renew License"</strong> button below.
              </p>
            </div>

            <div className="expired-buttons-group flex justify-between mt-4">
              <div className="left flex gap-4">
                <button>Renew License</button>
                <button onClick={handleReadLicense}>Read License</button>
              </div>
              <div className="right">
                <button onClick={handleLogout}>Logout</button>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-black-spray absolute top-0 left-0 bg-gradient-to-t from-[black] to-transparent h-screen w-screen"></div>
      </div>
    </>
  );
};

export default State05_Expired;
