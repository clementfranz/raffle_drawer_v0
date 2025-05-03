import React from "react";

import KopikoBlancaLogo from "~/assets/images/KopikoBlancaLogoTrimmed.png";
import KopikoBlancaVideo from "~/assets/videos/KopikoBlancaAd.webm";

const PresView_ScreenSaver = () => {
  return (
    <div className="bg-gray-600 h-full w-full flex justify-center items-center">
      <div className="brand-logo-shell z-20 flex flex-col justify-between items-center gap-10 opacity-90">
        <img src={KopikoBlancaLogo} alt="" />
        <span className="text-7xl text-center w-full font-[Montserrat] font-bold text-[#e61630] text-shadow-md text-shadow-black">
          Kopiko Blanca Raffle Draw
        </span>
      </div>
      <div className="video-background w-full h-screen absolute top-0 left-0 select-none">
        <div className="bg-overlay absolute h-screen w-full  bg-linear-to-b from-[#fdf2ba00] via-[#fdf2bac9] to-[#fdf2ba] opacity-75"></div>
        <video
          src={KopikoBlancaVideo}
          autoPlay
          muted
          loop
          className="h-full w-full object-cover"
        ></video>
      </div>
    </div>
  );
};

export default PresView_ScreenSaver;
