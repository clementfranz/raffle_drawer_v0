import type { Route } from "./+types/home";
import { sampleData } from "../data/sampleData";
import { useEffect, useState } from "react";

import HeaderNav from "~/components/HeaderNav/HeaderNav";

import ControlPanel from "../components/ControlPanel/_main/ControlPanel";
import PaginationBar from "~/components/DashboardComponents/PaginationBar/_main/PaginationBar";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight
} from "@fortawesome/free-solid-svg-icons";

import { getWeek } from "~/utils/dateTime";
import ParticipantsTable from "~/components/DashboardComponents/ParticipantsTable/_main/ParticipantsTable";

import useLocalStorageState from "use-local-storage-state";
import { NavLink, useLocation } from "react-router";
import ShowingEntriesCounter from "~/components/DashboardComponents/ShowingEntriesCounter/ShowingEntriesCounter";
import { hasAnyParticipants } from "~/hooks/indexedDB/_main/useIndexedDB";
import CloudSyncer from "~/components/CloudSyncer/CloudSyncer";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "KBRDS | Dashboard" },
    {
      name: "description",
      content: "Welcome to Kopiko Blanca Raffle Draw System"
    }
  ];
}

const presentWeek = getWeek();

export default function Main() {
  const [controlPanelOpen, setControlPanelOpen] = useState(true);

  interface FileDetails {
    entries: number;
  }

  const [fileDetails, setFileDetails] = useLocalStorageState<FileDetails>(
    "fileDetails",
    {
      defaultValue: { entries: 0 }
    }
  );

  const [isPresenting, setIsPresenting] = useState(false);
  const [participantsData, setParticipantsData] = useState<any[]>([]);
  const [loadingParticipantsData, setLoadingParticipantsData] =
    useState<boolean>(false);

  const location = useLocation();

  interface Week {
    weekName: string;
    [key: string]: any; // Add other properties if needed
  }

  const [selectedWeek, setSelectedWeek] = useLocalStorageState<Week>(
    "selectedWeek",
    {
      defaultValue: presentWeek as Week
    }
  );

  const [withParticipantsData, setWithParticipantsData] = useLocalStorageState(
    "withParticipantsData",
    {
      defaultValue: false
    }
  );

  type PresentingStatus = "presenting" | "not-presenting";

  const [presentingStatus, setPresentingStatus] =
    useLocalStorageState<PresentingStatus>("presentingStatus", {
      defaultValue: "not-presenting"
    });

  const toggleControlPanel = () => {
    setControlPanelOpen((prev) => !prev);
  };

  const isFilterActive = (filterValue: string) => {
    return new URLSearchParams(location.search).get("filter") === filterValue;
  };

  const checkForParticipants = async () => {
    console.log("Checking for Participants data FE");
    const check = await hasAnyParticipants();
    if (check) {
      console.log("Participants Data Found!");
      setWithParticipantsData(true);
    } else {
      console.log("NO Participants Data Found!");
      setWithParticipantsData(false);
    }
  };

  useEffect(() => {
    if (presentingStatus === "presenting") {
      setIsPresenting(true);
    } else {
      setIsPresenting(false);
    }
  }, [presentingStatus]);

  useEffect(() => {
    setSelectedWeek(presentWeek);
    checkForParticipants();
  }, []);

  return (
    <>
      <CloudSyncer />
      <HeaderNav isPresenting={isPresenting} />
      <div className="dashboard flex w-full h-[calc(100vh-50px)]">
        <main className=" main-panel  grow p-4 gap-4 flex flex-col">
          <div className="tabs flex justify-between items-center">
            <ul className="flex table-tabs">
              <li>
                <NavLink
                  to="/main"
                  className={() =>
                    !isFilterActive("winners") &&
                    !isFilterActive("backupwinners")
                      ? "active bg-orange-300"
                      : undefined
                  }
                >
                  All Participants
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/main?filter=winners"
                  className={() =>
                    isFilterActive("winners")
                      ? "active bg-orange-300"
                      : undefined
                  }
                >
                  Winners
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/main?filter=backupwinners"
                  className={() =>
                    isFilterActive("backupwinners")
                      ? "active bg-orange-300"
                      : undefined
                  }
                >
                  Backup Winners
                </NavLink>
              </li>
            </ul>
            <ShowingEntriesCounter />
            <ul className="flex space-x-4 text-sm">
              {withParticipantsData && (
                <li className="flex items-center justify-center h-full">
                  Total Participants for this week:&nbsp;
                  <b>{fileDetails?.entries.toLocaleString()}</b>
                </li>
              )}
              {/* <li>
                Weekly Increase:&nbsp;<b>10% </b>
              </li> */}
            </ul>
          </div>
          <ParticipantsTable />
          <div className="status-bar flex justify-between items-center text-sm">
            <div className="week-selector flex gap-1 bg-orange-200 h-[40px]  items-center justify-center rounded-full overflow-hidden">
              <div className="prev-week hover:bg-orange-300 h-full  px-4 content-center cursor-pointer">
                <FontAwesomeIcon icon={faChevronLeft} />
              </div>
              <div className="week-list hover:bg-orange-300 p-1 px-3 cursor-pointer rounded-full">
                Week of {selectedWeek.weekName}
              </div>
              <div className="next-week hover:bg-orange-300 h-full  px-4 content-center cursor-pointer">
                <FontAwesomeIcon icon={faChevronRight} />
              </div>
            </div>
            <PaginationBar />
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
        <ControlPanel
          controlPanelOpen={controlPanelOpen}
          setIsPresenting={setIsPresenting}
          isPresenting={isPresenting}
        />
      </div>
    </>
  );
}
