import type { Route } from "./+types/home";
import { sampleData } from "../data/sampleData";
import { use, useState } from "react";
import ControlPanel from "../components/ControlPanel";
import SettingsButton from "~/components/SettingsButton";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" }
  ];
}

export default function Main() {
  const [controlPanelOpen, setControlPanelOpen] = useState(false);

  const toggleControlPanel = () => {
    setControlPanelOpen((prev) => !prev);
  };

  return (
    <>
      <header className=" h-[50px]">
        <div className="flex items-center justify-between px-4 py-2 h-full">
          <h1 className="text-2xl font-bold">Kopiko Blanca</h1>
          <nav>
            <ul className="flex space-x-4">
              <li>
                <SettingsButton />
              </li>
              <li>
                <a href="/logout">Logout</a>
              </li>
            </ul>
          </nav>
        </div>
      </header>
      <div className="dashboard flex w-full h-[calc(100vh-50px)]">
        <main className=" main-panel  grow p-4 gap-4 flex flex-col">
          <div className="tabs flex justify-between items-center">
            <ul className="flex table-tabs">
              <li>
                <a href="/main" className="active bg-orange-300">
                  All Participants
                </a>
              </li>
              <li>
                <a href="/main/characters">Winners</a>
              </li>
              <li>
                <a href="/main/locations">Backup Winners</a>
              </li>
            </ul>
            <ul className="flex space-x-4 text-sm">
              <li>
                Total Participants for this week:&nbsp;<b>194,509</b>
              </li>
              <li>
                Weekly Increase:&nbsp;<b>10% </b>
              </li>
            </ul>
          </div>
          <div className="participants-table grow overflow-y-auto h-[500px]">
            <table className="min-w-full table-fixed border-separate border-spacing-0">
              <thead className="bg-[#bf4759] text-white sticky top-0 z-10">
                <tr>
                  <th className="p-2 text-left border-b">No.:</th>
                  <th className="p-2 text-left border-b">Participant's Name</th>
                  <th className="p-2 text-left border-b">Code</th>
                  <th className="p-2 text-left border-b">Location</th>
                </tr>
              </thead>
              <tbody className="">
                {sampleData.map((entry) => (
                  <tr key={entry.number} className="">
                    <td className="">{entry.number}</td>
                    <td className="">{entry.fullName}</td>
                    <td className="text-base font-bold">{entry.code}</td>
                    <td className="">{entry.region}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="status-bar flex justify-between items-center text-sm">
            <div className="week-selector flex gap-1 bg-orange-200 h-[40px]  items-center justify-center rounded-full overflow-hidden">
              <div className="prev-week hover:bg-orange-300 h-full  px-4 content-center cursor-pointer">
                &lt;
              </div>
              <div className="week-list hover:bg-orange-300 p-1 px-3 cursor-pointer rounded-full">
                Week of November 23 to 30
              </div>
              <div className="next-week hover:bg-orange-300 h-full  px-4 content-center cursor-pointer">
                &gt;
              </div>
            </div>
            <div className="pagination bg-orange-200 rounded-full text-xs flex flex-row  items-center overflow-hidden h-[30px]">
              <button className=" hover:bg-orange-300 px-2 ps-3 h-[30px] rounded-lg cursor-pointer text-sm">
                Prev
              </button>
              <div className="pages">
                <span className=" active">1</span>
                <span className="">2</span>
                <span className="">3</span>
                <div className="pagination-settings">
                  <span className="pagination-settings-button">...</span>
                  <div className="bg-orange-100 h-[30px]  items-center justify-center px-2 hidden">
                    Go to page{" "}
                    <input
                      className="ml-2 bg-white w-[30px] h-[20px] rounded-lg text-black text-center"
                      type="text"
                      aria-label="Page Number"
                      defaultValue="1"
                    />
                  </div>
                </div>
                <span className="">198</span>
                <span className="">199</span>
                <span className="">200</span>
              </div>
              <button
                type="button"
                className=" hover:bg-orange-300 px-2 pe-3 h-[30px] rounded-lg cursor-pointer text-sm"
              >
                Next
              </button>
            </div>
            <button
              className={`control-panel-button flex gap-4 rounded-s-full cursor-pointer ${
                controlPanelOpen ? "-mr-4" : "rounded-e-full"
              }`}
              onClick={toggleControlPanel}
              type="button"
            >
              {controlPanelOpen ? "Close Control Panel" : "Open Control Panel"}
            </button>
          </div>
        </main>
        <ControlPanel controlPanelOpen={controlPanelOpen} />
      </div>
    </>
  );
}
