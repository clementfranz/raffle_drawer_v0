import { useEffect, useState } from "react";
import type { Route } from "./+types/home";
import useLocalStorageState from "use-local-storage-state";

// HOOKS
import { useRouteSpecificBodyClass } from "~/hooks/bgChanger";

// VIEWS
import PresView_Intro from "~/components/PresentationViews/PresView_Intro/_main/PresView_Intro";
import PresView_Overview from "~/components/PresentationViews/PresView_Overview/_main/PresView_Overview";
import PresView_RaffleDraw from "~/components/PresentationViews/PresView_RaffleDraw/_main/PresView_RaffleDraw";
import PresView_ScreenSaver from "~/components/PresentationViews/PresView_ScreenSaver/_main/PresView_ScreenSaver";
import PresView_Transition from "~/components/PresentationViews/PresView_Transition/_main/PresView_Transition";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "KBRDS | Presenter" },
    { name: "description", content: "Welcome to React Router!" }
  ];
}

export default function Home() {
  useRouteSpecificBodyClass("/presenter", [
    "bg-gray-800!",
    "h-screen!",
    "w-screen!",
    "flex!",
    "transition-all",
    "duration-500"
  ]);

  const [presentingView, setPresentingView] = useLocalStorageState<
    string | null
  >("presentingView");

  const [lockViewCards, setLockViewCards] =
    useLocalStorageState("lockViewCards");

  const [transitionActive, setTransitionActive] =
    useLocalStorageState<boolean>("transitionActive");

  useEffect(() => {
    if (transitionActive) {
      setLockViewCards(true);
    } else {
      setLockViewCards(false);
    }
  }, [transitionActive]);

  useEffect(() => {
    setPresentingView("intro");
    setTransitionActive(false);
  }, []);

  return (
    <div className="w-full h-full">
      {(() => {
        switch (presentingView) {
          case "intro":
            return <PresView_Intro />;

          case "screen-saver":
            return <PresView_ScreenSaver />;

          case "overview":
            return <PresView_Overview />;

          case "raffle-draw":
            return <PresView_RaffleDraw />;

          default:
            return <PresView_Intro />;
        }
      })()}
      {transitionActive && (
        <div className="transition-shell absolute top-0">
          <PresView_Transition />
        </div>
      )}
    </div>
  );
}
