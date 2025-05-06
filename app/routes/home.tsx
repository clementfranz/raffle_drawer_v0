import type { Route } from "./+types/home";
import { Welcome } from "../welcome/welcome";
import useLocalStorageState from "use-local-storage-state";
import { useEffect, useState } from "react";

import InfoPrint from "./infoprint";
import Main from "./main";
import Presenter from "./presenter";
import { useSearchParams } from "react-router";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "KBRDS | Welcome Page" },
    { name: "description", content: "Welcome to React Router!" }
  ];
}

export default function Home() {
  const [SPA_status, setSPA_status] = useLocalStorageState("spa_status", {
    defaultValue: false
  });

  const [queriedPage, setQueriedPage] = useState("");

  const [searchParams] = useSearchParams();

  useEffect(() => {
    // Get the "page" query param
    const page = searchParams.get("page");
    console.log("Page param is:", page);
    setQueriedPage(page ?? "");
  }, [searchParams]);

  // ✅ Component selector logic
  let RenderedComponent;

  if (!SPA_status) {
    RenderedComponent = <Welcome />;
  } else {
    switch (queriedPage) {
      case "main":
        RenderedComponent = <Main />;
        break;
      case "infoprint":
        RenderedComponent = <InfoPrint />;
        break;
      case "presenter":
        RenderedComponent = <Presenter />;
        break;
      default:
        RenderedComponent = <Welcome />;
        break;
    }
  }

  return <>{RenderedComponent}</>;
}
