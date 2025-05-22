import { Outlet, useNavigate } from "react-router";

import KopikoWoodenTableBG from "~/assets/images/KopikoWoodenTableBG.jpg";

export default function WrapperLayout() {
  const navigate = useNavigate();
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
        <article className="grow h-full flex overflow-y-auto justify-center">
          <div className="shell h-full w-[800px] relative">
            <Outlet />
          </div>
        </article>
      </main>
    </div>
  );
}
