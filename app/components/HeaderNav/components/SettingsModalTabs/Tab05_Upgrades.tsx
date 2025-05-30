import React from "react";
import { NavLink } from "react-router";

const Tab05_Upgrades = () => {
  return (
    <div className="flex flex-col gap-2 relative">
      <div className=" bg-white/50 backdrop-blur-sm sticky py-4 top-0 z-5 px-4 flex justify-between items-center">
        <h1 className="text-2xl">Upgrades Available</h1>

        <NavLink
          to={
            "https://clients.clementfranz.site/portal?c=kopikoblanca&key=aZ9B-q3Xr-MtL2-GVn7-KfWp&section=avail-upgrades"
          }
          target="_blank"
        >
          <button className="px-4 py-2 bg-amber-300 hover:bg-amber-200 text-black font-semibold rounded-lg shadow cursor-pointer w-fit text-sm">
            Avail Upgrades Now
          </button>
        </NavLink>
      </div>
      <div className="options grid grid-cols-3 grow gap-8 overflow-y-auto  pb-8 overflow-x-hidden">
        <OptionItem>
          <OptionTitle>Live Data Sync Mode</OptionTitle>
          <OptionBody>
            Replace offline-first setup with direct, real-time database syncing
            for accurate, always-fresh data—ideal for LAN or reliable internet.
          </OptionBody>
          <OptionFooter>₱5,000</OptionFooter>
        </OptionItem>

        <OptionItem>
          <OptionTitle>Custom Branding Support</OptionTitle>
          <OptionBody>
            Personalize the app with your own logo, product name, and intro
            video—great for events and company-branded versions.
          </OptionBody>
          <OptionFooter>₱5,000</OptionFooter>
        </OptionItem>

        <OptionItem>
          <OptionTitle>Mobile Admin Panel Access</OptionTitle>
          <OptionBody>
            Use a mobile-friendly control link to start raffles or trigger
            actions remotely—no need for PC control during events.
          </OptionBody>
          <OptionFooter>₱5,000</OptionFooter>
        </OptionItem>

        <OptionItem>
          <OptionTitle>Enhanced Raffle Animation with Sound FX</OptionTitle>
          <OptionBody>
            High-quality draw animations and sound effects to impress your
            audience and boost excitement during live events.
          </OptionBody>
          <OptionFooter>₱5,000</OptionFooter>
        </OptionItem>

        <OptionItem>
          <OptionTitle>Facebook Chatbot Integration to Raffle DB</OptionTitle>
          <OptionBody>
            Connect a Facebook Messenger bot directly to your raffle
            database—automatically register entries from chat messages in
            real-time.
          </OptionBody>
          <OptionFooter>₱20,000</OptionFooter>
        </OptionItem>

        <OptionItem>
          <OptionTitle>
            Public Broadcasting Mode / Stream License Support
          </OptionTitle>
          <OptionBody>
            Enable broadcasting-ready features (e.g., watermark, audio filters,
            full-screen display), and optional license for public use or
            livestreams.
          </OptionBody>
          <OptionFooter>₱20,000</OptionFooter>
        </OptionItem>
      </div>
    </div>
  );
};

const OptionItem = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className=" drop-shadow-lg rounded-xl overflow-hidden flex flex-col">
      {children}
    </div>
  );
};

const OptionTitle = ({ children }: { children?: React.ReactNode }) => {
  return (
    <div className="px-3 uppercase font-semibold py-4 bg-gray-300">
      {children}
    </div>
  );
};

const OptionBody = ({ children }: { children?: React.ReactNode }) => {
  return <div className="px-3 bg-gray-100 grow py-3 text-sm">{children}</div>;
};

const OptionFooter = ({ children }: { children?: React.ReactNode }) => {
  return (
    <div className="px-3 py-4 flex justify-end bg-amber-100 font-semibold font-mono text-lg">
      {children}
    </div>
  );
};

export default Tab05_Upgrades;
