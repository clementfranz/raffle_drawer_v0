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
    { title: "KBNRDS | Welcome Page" },
    { name: "description", content: "Welcome to React Router!" }
  ];
}

export default function Home() {
  return (
    <>
      <Welcome />
    </>
  );
}
