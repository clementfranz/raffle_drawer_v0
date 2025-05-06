import useLocalStorageState from "use-local-storage-state";
import logoDark from "./logo-dark.svg";
import logoLight from "./logo-light.svg";

import { latestUpdateData } from "~/data/latestUpdateData";
import { urlFilter } from "~/hooks/spaLinker";

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
      className={`flex flex-col items-center justify-start pt-16 pb-4 w-screen h-screen ${
        SPA_status && "bg-pink-400"
      } `}
    >
      <h1 className="font-bold text-lg">Sample Title</h1>
      <br />
      <p>This project is a work in progress.</p>
      <br />
      <p className="mb-4">Try the following working pages for now:</p>
      <div className="links flex gap-5">
        <a
          href={urlFilter("/main", "?page=main")}
          className="bg-amber-950 text-white font-bold p-4 rounded-2xl hover:bg-amber-800"
        >
          Dashboard
        </a>
        <a
          href={urlFilter("/presenter", "?page=presenter")}
          className="bg-red-800 text-white font-bold p-4 rounded-2xl hover:bg-red-700"
        >
          Presenter Mode (newer version)
        </a>
      </div>
      <div className="last-update italic text-sm mt-5">
        Last System Update: {latestUpdateData}
      </div>
      <div className="last-update  text-sm mt-5">
        <b>Note:</b>
        <br />
        <p className="text-red-700">
          Presenter Mode can be controlled under Presentation Tab inside Control
          Panel
        </p>
      </div>
      <div className="spa-switch mt-10 flex flex-col justify-center items-center">
        <h1 className="mb-5">
          Bypass rewrite engine problem. Turn on SPA switch below:
        </h1>
        <button
          className="bg-red-800 text-white font-bold p-2 px-4 rounded-2xl hover:bg-red-700 uppercase cursor-pointer"
          onClick={handleSPAToggle}
        >
          {!SPA_status ? "Turn On SPA Mode" : "Turn Off SPA Mode"}
        </button>
      </div>
    </main>
  );
}
