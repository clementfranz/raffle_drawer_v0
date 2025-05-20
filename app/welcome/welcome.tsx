import useLocalStorageState from "use-local-storage-state";

import { latestUpdateData } from "~/data/latestUpdateData";
import { urlFilter } from "~/hooks/spaLinker";

import KopikoWoodenTableBG from "~/assets/images/KopikoWoodenTableBG.jpg";
import KopikoBlancaLogoTrimmed from "~/assets/images/KopikoBlancaLogoTrimmed.png";
import KopikoProducts from "~/assets/images/KopikoProducts.png";
import KopikoCoffeeBeansSack from "~/assets/images/KopikoCoffeeBeansSack.png";
import KopikoBrownBeans from "~/assets/images/KopikoBrownBeans.jpg";
import KopikoLogo from "~/assets/images/Kopiko.svg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";

export function Welcome() {
  const [SPA_status, setSPA_status] = useLocalStorageState("spa_status", {
    defaultValue: false
  });

  const handleSPAToggle = () => {
    if (SPA_status) {
      setSPA_status(false);
    } else {
      setSPA_status(true);
    }
  };
  return (
    <main
      className="flex items-center justify-start w-screen h-screen bg-cover bg-left relative"
      style={{ backgroundImage: `url(${KopikoWoodenTableBG})` }}
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
        <div className="login-box w-[450px] h-[550px] rounded-4xl relative overflow-hidden">
          {/* Background Layer */}
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
                placeholder="Type Password"
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
              <button
                type="submit"
                className="bg-[#7e061a] hover:bg-[#7e061acb] text-[white] w-[250px] py-2 px-2.5 rounded-xl cursor-pointer gap-3 flex justify-center items-center"
              >
                <FontAwesomeIcon icon={faGoogle} />
                <span>Login with Google</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
