import React, { useState } from "react";

import KopikoBlancaLogoTrimmed from "~/assets/images/KopikoBlancaLogoTrimmed.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import GoogleLoginButton from "../GoogleLoginButton/GoogleLoginButton";
import EmailLoginButton from "../EmailLoginButton/EmailLoginButton";
import useLocalStorageState from "use-local-storage-state";

type LoginBoxProps = {
  hasConsented: boolean;
};

const LoginBox = ({ hasConsented }: LoginBoxProps) => {
  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");

  const [isServerActive, setIsServerActive] = useLocalStorageState<boolean>(
    "isServerActive",
    { defaultValue: true }
  );

  const [errorMessage, setErrorMessage] = useState("");

  return (
    <>
      {/* Content Layer */}
      <div className="relative z-10 w-full h-full py-5">
        <div className="portal-label font-[Montserrat] text-xl uppercase w-full text-center font-bold text-white bg-[#000000a9] py-2">
          Login Portal
        </div>
        <div className="kopikoblanca-logo w-full  mb-3 -mt-2 flex items-center justify-center">
          <img src={KopikoBlancaLogoTrimmed} alt="" className="h-[100px]" />
        </div>
        <div className="portal-label font-[Montserrat] text-lg uppercase w-full text-center font-bold text-white">
          National Raffle Draw System
        </div>

        <EmailLoginButton
          setErrorMessage={setErrorMessage}
          hasConsented={hasConsented}
        />
        <div className="form flex flex-col gap-2 items-center justify-center w-full mt-2 hidden">
          <div className="or text-white">-- or --</div>
          <GoogleLoginButton setErrorMessage={setErrorMessage} />
        </div>
        {errorMessage && (
          <div className="error-message absolute bottom-0 bg-[#880202ce] text-white text-sm min-w-[250px] p-4 left-1/2 -translate-y-[10px] -translate-x-1/2 rounded-2xl text-center animate-pulse text-balance">
            {errorMessage}
          </div>
        )}
      </div>
    </>
  );
};

export default LoginBox;
