import type { Route } from "./+types/home";
import { Welcome } from "../welcome/welcome";
import useLocalStorageState from "use-local-storage-state";
import { useEffect, useState } from "react";

import InfoPrint from "./infoprint";
import Main from "./main";
import Presenter from "./presenter";
import { Navigate, useLocation, useSearchParams } from "react-router";
import { useAuth } from "~/auth/AuthContext";
import DefaultLoader from "~/components/Loaders/DefaultLoader/DefaultLoader";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "KBNRDS | Welcome Page" },
    { name: "description", content: "Welcome to React Router!" }
  ];
}

export default function Home() {
  const { user, loading } = useAuth();
  const location = useLocation();

  console.log("🟢🟢🟢🟢 ACTIVE USER: ", user);

  const isAtRoot = location.pathname === "/";

  return (
    <div className="overflow-hidden relative h-screen w-screen">
      <div className={!loading ? "hidden" : ""}>
        <DefaultLoader />
      </div>

      {user && isAtRoot && !loading ? (
        <Navigate to="/main" replace />
      ) : (
        <Welcome />
      )}
    </div>
  );
}
