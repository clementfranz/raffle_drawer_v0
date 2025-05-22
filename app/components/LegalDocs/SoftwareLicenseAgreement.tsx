import { faLock } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { useAuth } from "~/auth/AuthContext";
import "./SoftwareLicenseAgreement.css";
import Sec01_BackgroundAndPurpose from "./data/SLA_Contents/Sec01_BackgroundAndPurpose";
import Sec02_Definitions from "./data/SLA_Contents/Sec02_Definitions";
import Sec03_GrantOfLicense from "./data/SLA_Contents/Sec03_GrantOfLicense";
import Sec04_OwnershipAndIP from "./data/SLA_Contents/Sec04_OwnershipAndIP";
import Sec05_LicenseFeeAndRenewal from "./data/SLA_Contents/Sec05_LicenseFeeAndRenewal";
import Sec06_UsageConditions from "./data/SLA_Contents/Sec06_UsageConditions";

const SoftwareLicenseAgreement = () => {
  const { user } = useAuth();
  return (
    <>
      {user ? (
        <div className="relative py-5 mt-5">
          <div className="title text-white py-4 text-3xl uppercase font-bold text-center w-full sticky top-0 bg-[#000000ce] z-[30]">
            Software License Agreement
          </div>
          <div className="content p-5 bg-[#ffffffad]">
            <div className="px-8 py-8 text-gray-800 rounded-2xl  max-w-5xl mx-auto leading-relaxed tracking-wide space-y-6 text-justify text-base">
              <h1 className="text-3xl font-extrabold text-center text-gray-900 mb-4 hidden">
                SOFTWARE LICENSE AGREEMENT
              </h1>
              <p>
                <strong>This Software License Agreement</strong> ("Agreement")
                is entered into as of <strong>May 25, 2025</strong> ("Effective
                Date") by and between:
              </p>

              <div className="bg-[#000000d7] text-white rounded-xl p-5 pr-10">
                <h2 className="text-lg font-semibold mb-2">Developer:</h2>
                <ul className="list-disc ml-6">
                  <li>
                    <strong>Name:</strong> Clement Francis Delos Santos
                  </li>
                  <li>
                    <strong>Nationality:</strong> Filipino
                  </li>
                  <li>
                    <strong>Status:</strong> Independent freelance software
                    developer
                  </li>
                  <li>
                    <strong>Email:</strong> delossantos.clementfrancis@gmail.com
                  </li>
                  <li>
                    <strong>Phone:</strong> 0977-791-9318 | 0992-706-1517
                  </li>
                </ul>
                <h2 className="text-lg font-semibold mt-4 mb-2">Licensee:</h2>
                <ul className="list-disc ml-6 text-left">
                  <li>
                    <strong>Name:</strong> Kevin Conrado
                  </li>
                  <li>
                    <strong>Status:</strong> Employee of Vouno Trade and
                    Marketing Services Corporation, acting in personal capacity
                    as the client
                  </li>
                  <li>
                    <strong>Email:</strong> kevin.conrado@vouno.com.ph
                  </li>
                  <li>
                    <strong>Phone:</strong> 0917-509-6733
                  </li>
                </ul>
              </div>

              <p className="italic text-center">
                Collectively referred to as the <strong>“Parties”.</strong>
              </p>

              <article className={`sections`}>
                <Sec01_BackgroundAndPurpose />
                <Sec02_Definitions />
                <Sec03_GrantOfLicense />
                <Sec04_OwnershipAndIP />
                <Sec05_LicenseFeeAndRenewal />
                <Sec06_UsageConditions />
              </article>

              <div className="text-sm text-gray-600">
                <p>
                  <strong>Document ID:</strong> CFZ-KBNRDS-LICENSE-V1.0-20250525
                </p>
                <p>
                  <strong>License Verification URL:</strong>{" "}
                  <a
                    href="https://clients.clementfranz.site/licences/CFZ-KBNRDS-LICENSE-V1.0-20250525"
                    className="text-blue-600 underline"
                  >
                    https://clients.clementfranz.site/licences/CFZ-KBNRDS-LICENSE-V1.0-20250525
                  </a>
                </p>
                <p className="mt-2 italic">
                  Any tampering or replacement of this license document will not
                  affect the official record hosted at the link above.
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="grow h-full flex justify-center items-center">
          <div className="message-box bg-[#000000ad] text-white p-10 rounded-4xl justify-center flex flex-col">
            <FontAwesomeIcon icon={faLock} className="text-5xl pb-5" />
            <div className="message">
              You need to login first to see this private SLA.
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SoftwareLicenseAgreement;
