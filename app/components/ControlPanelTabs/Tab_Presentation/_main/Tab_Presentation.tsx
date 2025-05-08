import React, { useState } from "react";

// UI Components
import TabMainBody from "~/ui/ControlPanelUI/TabMainBody/_main/TabMainBody";
import TabShell from "~/ui/ControlPanelUI/TabShell/_main/TabShell";
import TabSubPanel from "~/ui/ControlPanelUI/TabSubPanel/_main/TabSubPanel";
import TabActionButton from "~/ui/ControlPanelUI/TabActionButton/_main/TabActionButton";
import useLocalStorageState from "use-local-storage-state";

// Components
import ViewCards from "../components/ViewCards/_main/ViewCards";

// View Cards Thumbnails
import ScreenSaverThumbnail from "~/assets/images/viewCardThumbnails/ScreenSaverThumbnail.png";
import IntroOnlyThumbnail from "~/assets/images/viewCardThumbnails/IntroOnlyThumnail.png";
import ParticipantsOverviewThumbnail from "~/assets/images/viewCardThumbnails/ParticipantsOverviewThumbnail.png";
import RaffleDrawThumbnail from "~/assets/images/viewCardThumbnails/RaffleDrawThumbnail.png";

interface Tab_PresentationProps {
  isActiveTab?: boolean;
}

const Tab_Presentation: React.FC<Tab_PresentationProps> = ({ isActiveTab }) => {
  const [presentingView, setPresentingView] = useLocalStorageState(
    "presentingView",
    {
      defaultValue: "intro"
    }
  );

  const [lockViewCards, setLockViewCards] = useLocalStorageState(
    "lockViewCards",
    { defaultValue: false }
  );

  const [transitionActive, setTransitionActive] = useLocalStorageState(
    "transitionActive",
    { defaultValue: false }
  );

  const enterTransition = () => {
    setTransitionActive(true);
  };

  const exitTransition = () => {
    setTransitionActive(false);
  };

  const transitViewTo = (targetView: string) => {
    if (presentingView !== targetView) {
      enterTransition();

      const transitTimer = setTimeout(() => {
        setPresentingView(targetView);

        clearTimeout(transitTimer);
      }, 3000);
    }
  };

  const [activeThumbnail, setActiveThumbnail] = useState(IntroOnlyThumbnail);

  const transitToDefault = () => {
    transitViewTo("intro");
    setActiveThumbnail(IntroOnlyThumbnail);
  };

  const transitToOverview = () => {
    transitViewTo("overview");
    setActiveThumbnail(ParticipantsOverviewThumbnail);
  };

  const transitToRaffleDraw = () => {
    transitViewTo("raffle-draw");
    setActiveThumbnail(RaffleDrawThumbnail);
  };

  const transitToScreenSaver = () => {
    transitViewTo("screen-saver");
    setActiveThumbnail(ScreenSaverThumbnail);
  };

  return (
    <>
      <TabMainBody isActive={isActiveTab}>
        <TabShell position="top">
          <TabSubPanel title="Presentation Preview">
            <div className="view-options flex  gap-2 justify-center w-full">
              <div
                className="view-preview  rounded-md aspect-video flex justify-center items-end text-sm  w-[80%] bg-cover bg-center transition-all duration-500"
                style={{ backgroundImage: `url(${activeThumbnail})` }}
              >
                <div className="label">Raffle Winner</div>
              </div>
            </div>
          </TabSubPanel>
          <TabSubPanel title={"Choose Views"}>
            <div className="view-options grid grid-cols-2 gap-2 relative">
              <ViewCards
                onClick={transitToDefault}
                thumbnailUrl={IntroOnlyThumbnail}
              >
                Intro Only
              </ViewCards>
              <ViewCards
                onClick={transitToScreenSaver}
                thumbnailUrl={ScreenSaverThumbnail}
              >
                Screen Saver
              </ViewCards>
              <ViewCards
                onClick={transitToOverview}
                thumbnailUrl={ParticipantsOverviewThumbnail}
              >
                Participants <br /> Overview
              </ViewCards>
              <ViewCards
                onClick={transitToRaffleDraw}
                thumbnailUrl={RaffleDrawThumbnail}
              >
                Raffle Draw
              </ViewCards>
              <div
                className={`loading-wall absolute top-0 left-0 bg-[#000000be] h-full w-full flex justify-center items-center text-white rounded-lg transition-all duration-500 ${
                  lockViewCards ? "z-30 opacity-100" : "-z-10 opacity-0"
                }`}
              >
                Loading View... Please wait..
              </div>
            </div>
          </TabSubPanel>
        </TabShell>
        <TabShell position="bottom">
          <TabActionButton>Pause Presentation</TabActionButton>
        </TabShell>
      </TabMainBody>
    </>
  );
};

export default Tab_Presentation;
