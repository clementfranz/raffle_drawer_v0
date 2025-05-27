import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router";

import KopikoWoodenTableBG from "~/assets/images/KopikoWoodenTableBG.jpg";

import type { Route } from "./+types/WrapperLayout";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "KPC Docs" },
    { name: "description", content: "Welcome to React Router!" }
  ];
}

export default function WrapperLayout() {
  const navigate = useNavigate();

  const [isThereHighlight, setIsThereHighlight] = useState(true);

  const scrollToHighlight = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const highlightId = urlParams.get("highlight");

    const scrollContainer = document.getElementById("scroll-container");

    if (highlightId && scrollContainer) {
      const el = document.getElementById(highlightId);

      if (el) {
        const containerTop = scrollContainer.getBoundingClientRect().top;
        const targetTop = el.getBoundingClientRect().top;

        const offset = targetTop - containerTop - 50; // 50px offset

        scrollContainer.scrollTo({
          top: scrollContainer.scrollTop + offset,
          behavior: "smooth"
        });

        setIsThereHighlight(true);
      }
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      scrollToHighlight();
    }, 100); // Small delay to ensure render is complete

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isThereHighlight) return;

    const scrollContainer = document.getElementById("scroll-container");
    if (!scrollContainer) return;

    const viewportHeight = window.innerHeight;
    let cleared = false;

    const handleScroll = () => {
      if (cleared) return;

      if (scrollContainer.scrollTop >= viewportHeight) {
        const url = new URL(window.location.href);
        url.searchParams.delete("highlight");
        window.history.replaceState({}, "", url.toString());

        setIsThereHighlight(false);
        cleared = true;
      }
    };

    scrollContainer.addEventListener("scroll", handleScroll);
    return () => scrollContainer.removeEventListener("scroll", handleScroll);
  }, [isThereHighlight]);

  return (
    <div
      className="flex items-center justify-center w-screen h-screen bg-cover bg-center relative flex-col"
      style={{ backgroundImage: `url(${KopikoWoodenTableBG})` }}
    >
      <header className="w-full h-[60px] px-5 flex justify-between items-center">
        <h1>Kopiko Blanca - National Raffle Draw System Docs</h1>
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-red-950 cursor-pointer text-sm text-white rounded-2xl hover:bg-red-900"
        >
          Go Back
        </button>
      </header>
      <main className="grow h-0 w-full">
        <article
          className="grow h-full flex overflow-y-auto justify-center "
          id="scroll-container"
        >
          <div className="shell h-full w-[800px] relative">
            <Outlet />
          </div>
        </article>
      </main>
    </div>
  );
}
