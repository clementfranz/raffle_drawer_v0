import { useLocation } from "react-router";
import type { Route } from "./+types/home";
import { useEffect, useRef, useState } from "react";

import { giberate, ungiberate } from "~/utils/gibberator";

import { hashPassword, checkPassword } from "~/utils/bcrypthasher";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "404 Not Found" },
    { name: "description", content: "404 Not Found" }
  ];
}

export default function InfoPrint() {
  const location = useLocation();

  const [infoPrintBook, setInfoPrintBook] = useState<any>("something");

  // Get search params from URL
  const searchParams = new URLSearchParams(location.search);
  const rc = searchParams.get("rc");
  const key = searchParams.get("key");
  const rcHash = "$2b$10$SDe5U6Uf1h94wj/PRb.5k.beRzlD5Fblvi1SEfe/hZw10B/HrXczm";
  const keyHash =
    "$2b$10$GkbXtKUtrmxKj/UR45c.0ejfFTW2C6F8jrmxDsB8jIpLYC.05ctrW";

  const inputRef = useRef<HTMLInputElement>(null); // Correctly typed ref

  const validateParams = async () => {
    const validRC = rc ? await checkPassword(rc, rcHash) : false;
    const validKey = key ? await checkPassword(key, keyHash) : false;

    return validRC && validKey;
  };
  // Check if valid
  const [isValid, setIsValid] = useState(false);

  // Validate params and update state
  useEffect(() => {
    const checkValidity = async () => {
      const valid = await validateParams();
      setIsValid(valid);
    };
    checkValidity();
  }, []);

  // Focus the input if valid
  useEffect(() => {
    if (isValid && inputRef.current) {
      inputRef.current.focus(); // Focus instead of click
    }
  }, [isValid]);

  if (isValid) {
    return (
      <div className="input-shell h-screen bg-emerald-950 w-full flex items-center justify-center">
        {infoPrintBook ? (
          <div className="infoprint-book bg-emerald-100 h-[50%] aspect-square p-8 rounded-2xl text-sm">
            <p className="text-center">
              {ungiberate("Uijt!jt!b!dfsujgjdbujpo!uibu", "shift")} <br />{" "}
              <b>{ungiberate("Dmfnfou!Gsbodjt!Efmpt!Tboupt", "shift")}</b>
              <br />
              {ungiberate("jt!uif!psjhjobm!nblfs!pg!uijt!xfctjuf/", "shift")}
              <br />
              {ungiberate("If!dpousjcvufe!211&!pg!uif!dpef/", "shift")}
            </p>
            <br />
            <p>
              {ungiberate(
                "If!)opu!fnqmpzfe!cz!uif!dpnqboz*!xbt!dpnnjttjpofe!cz",
                "shift"
              )}{" "}
              <b>{ungiberate("Ns/!Bopoznpvt", "shift")}</b>
              {ungiberate(
                "!)fnqmpzfe!cz!Lpqjlp!Cmbodb!Qijmjqqjoft*!bt!b!uijse.qbsuz!qsphsbnnfs!gps!uijt!tztufn!up!jnqspwf!qsfwjpvt!fyjtujoh!tztufn/!Ju!xbt!qbje!cz!b!tnbmm!voejtdmptfe!bnpvou/!Uif!qsjdf!jt!bhsffe!evf!up!uif!gpmmpxjoh!sfbtpot;",
                "shift"
              )}
            </p>
            <ul className="mt-4 ">
              <li className="">
                {ungiberate(
                  "⭑!Ns/!Bopoznpvt!jt!b!sfhvmbs!fnqmpzff!pg!uif!dpnqboz!boe!dpotjefst!uijt!bt!b!tjef!qspkfdu!boe!dbo!pomz!bggpse!up!qbz!tnbmm!bnpvou",
                  "shift"
                )}
              </li>
              <li>
                {ungiberate(
                  "⭑!Ns/!Qsphsbnnfs!bhsffe!up!dibmmfohf!ijntfmg!boe!qspwf!ijt!tljmm!up!puifs!fnqmpzfst/",
                  "shift"
                )}
              </li>
            </ul>
          </div>
        ) : (
          <input
            type="password"
            className="bg-emerald-800 text-emerald-950 p-3 text-center rounded-full"
            name="entry-code"
            id="entry-code"
            aria-label="entry-code"
            ref={inputRef}
          />
        )}
      </div>
    );
  }

  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1>404</h1>
      <p>The requested page could not be found.</p>
    </main>
  );
}
