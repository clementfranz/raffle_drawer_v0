import useLocalStorageState from "use-local-storage-state";

import { latestUpdateData } from "~/data/latestUpdateData";
import { urlFilter } from "~/hooks/spaLinker";

import KopikoWoodenTableBG from "~/assets/images/KopikoWoodenTableBG.jpg";
import KopikoWelcomeBGBlur from "~/assets/images/KopikoWelcomeBGBlur.jpg";
import KopikoWelcomeBGHighDef from "~/assets/images/KopikoWelcomeBGHighDef.jpg";
import KopikoProducts from "~/assets/images/KopikoProducts.png";
import KopikoCoffeeBeansSack from "~/assets/images/KopikoCoffeeBeansSack.png";
import KopikoBrownBeans from "~/assets/images/KopikoBrownBeans.jpg";
import KopikoLogo from "~/assets/images/Kopiko.svg";
import LoginBox from "./LoginBox/LoginBox";
import LazyBackground from "~/ui/LazyImage/LazyBackground";
import { Link } from "react-router";
import { useState } from "react";

export function Welcome() {
  const [SPA_status, setSPA_status] = useLocalStorageState("spa_status", {
    defaultValue: false
  });

  const [hasConsented, setHasConsented] = useState(false);

  const handleCheckConsent = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHasConsented(e.target.checked);
  };

  const handleSPAToggle = () => {
    if (SPA_status) {
      setSPA_status(false);
    } else {
      setSPA_status(true);
    }
  };
  return (
    <LazyBackground
      className="flex items-center justify-start w-screen h-screen bg-cover bg-left"
      blurUrl={KopikoWelcomeBGBlur}
      hdUrl={KopikoWelcomeBGHighDef}
    >
      <div className="left  h-full flex flex-col justify-center items-center relative w-3/5">
        <div
          className="kopiko-products absolute bottom-0 bg-contain bg-bottom z-[5] w-[75%] h-full bg-no-repeat"
          style={{ backgroundImage: `url(${KopikoProducts})` }}
        ></div>
        <div className="kopiko-brand flex flex-col justify-center w-full items-center -mt-[150px] z-[5] ">
          <div className="welcome text-5xl font-bold font-[Montserrat] -mb-[80px] -translate-x-[30px] text-white rotate-[-8deg] ">
            Welcome to
          </div>
          <div className="kopiko-logo w-full flex justify-center items-center">
            <img src={KopikoLogo} alt="" className="w-[550px]" />
          </div>
          <div className="welcome text-6xl font-bold font-[Montserrat] -mt-[50px] rotate-[-8deg] uppercase text-[#ffffff]">
            Philippines
          </div>
        </div>
        <div className="absolute bg-gradient-to-r from-[#301700] to-transparent w-full h-full top-0 z-[1]"></div>
      </div>
      <div className="right h-full justify-center items-center flex w-2/5">
        <div className="login-box w-[450px] h-[550px] rounded-4xl relative ">
          {/* Background Layer */}
          <div className="h-full w-full rounded-4xl overflow-hidden relative">
            <div
              className="absolute inset-0 bg-cover bg-center opacity-90 z-0"
              style={{ backgroundImage: `url(${KopikoBrownBeans})` }}
            ></div>
            <div className="absolute inset-0 bg-gradient-to-b from-[#00000098] to-transparent"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-[#77777798] via-transparent to-transparent"></div>
            <div
              className="absolute inset-0 bg-contain bg-bottom opacity-90 z-0 bg-no-repeat"
              style={{ backgroundImage: `url(${KopikoCoffeeBeansSack})` }}
            ></div>
            <LoginBox hasConsented={hasConsented} />
          </div>

          <div className="eula absolute bottom-0 text-sm px-[40px] pt-3 translate-y-full w-full flex justify-center items-center">
            <div className="wrapper w-full flex justify-between items-start gap-2">
              <div className="checkbox grow  w-fit flex  justify-end">
                <input
                  type="checkbox"
                  id="consent"
                  name="consent"
                  aria-label="consent"
                  className="mt-1"
                  onChange={(e) => handleCheckConsent(e)}
                  checked={hasConsented}
                />
              </div>
              <div className="label text-left w-fit  grow-0 ">
                <label
                  htmlFor="
            consent"
                  className=""
                >
                  By continued use, I agree to the system's{" "}
                  <Link
                    to="/docs/privacy-policy"
                    className="text-cyan-800 hover:underline hover:text-cyan-600 font-semibold"
                    target="_blank"
                  >
                    Privacy Policy
                  </Link>
                  ,{" "}
                  <Link
                    to="/docs/terms-and-condition"
                    className="text-cyan-800 hover:underline hover:text-cyan-600 font-semibold"
                    target="_blank"
                  >
                    Terms and Conditions
                  </Link>
                  , and{" "}
                  <Link
                    to="/docs/software-license-agreement-v1"
                    className="text-cyan-800 hover:underline hover:text-cyan-600 font-semibold"
                    target="_blank"
                  >
                    EULA
                  </Link>
                  .
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </LazyBackground>
  );
}
