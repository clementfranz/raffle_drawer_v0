import type { Route } from "./+types/home";
import { Welcome } from "../welcome/welcome";
import useLocalStorageState from "use-local-storage-state";
import { useEffect, useState } from "react";

import InfoPrint from "./infoprint";
import Main from "./main";
import Presenter from "./presenter";
import { Navigate, useLocation, useSearchParams } from "react-router";
import { useAuth } from "~/auth/AuthContext";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "KBNRDS | Welcome Page" },
    { name: "description", content: "Welcome to React Router!" }
  ];
}

export default function Home() {
  const { user } = useAuth();
  const location = useLocation();

  console.log("🟢🟢🟢🟢 ACTIVE USER: ", user);

  const isAtRoot = location.pathname === "/";

  if (user && isAtRoot) {
    return <Navigate to="/main" replace />;
  }

  return <Welcome />;
}
