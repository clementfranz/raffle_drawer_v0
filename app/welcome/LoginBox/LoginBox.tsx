import React, { useState } from "react";

import KopikoBlancaLogoTrimmed from "~/assets/images/KopikoBlancaLogoTrimmed.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import GoogleLoginButton from "../GoogleLoginButton/GoogleLoginButton";

const LoginBox = () => {
  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");

  return (
    <>
      {/* Content Layer */}
      <div className="relative z-10 w-full py-5">
        <div className="portal-label font-[Montserrat] text-xl uppercase w-full text-center font-bold text-white bg-[#000000a9] py-2">
          Login Portal
        </div>
        <div className="kopikoblanca-logo w-full  mb-3 -mt-2 flex items-center justify-center">
          <img src={KopikoBlancaLogoTrimmed} alt="" className="h-[100px]" />
        </div>
        <div className="portal-label font-[Montserrat] text-lg uppercase w-full text-center font-bold text-white">
          National Raffle Draw System
        </div>
        <div className="form flex flex-col gap-3 items-center justify-center w-full mt-6">
          <input
            type="text"
            name="email"
            id="email"
            placeholder="Email"
            className="bg-white w-[250px] py-2 px-2.5 rounded-xl"
          />
          <input
            type="password"
            name="passowrd"
            id="passowrd"
            placeholder="Password"
            className="bg-white w-[250px] py-2 px-2.5 rounded-xl"
          />
          <button
            type="submit"
            className="bg-[#df0427] hover:bg-[#df0429c4] text-[white] w-[250px] py-2 px-2.5 rounded-xl cursor-pointer"
          >
            Login
          </button>
        </div>
        <div className="form flex flex-col gap-2 items-center justify-center w-full mt-2">
          <div className="or text-white">-- or --</div>
          <GoogleLoginButton />
        </div>
      </div>
    </>
  );
};

export default LoginBox;
