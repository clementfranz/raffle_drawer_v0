import { faLock } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect } from "react";
import { useAuth } from "~/auth/AuthContext";
import "./SoftwareLicenseAgreement.css";
import Sec01_BackgroundAndPurpose from "./data/SLA_Contents/Sec01_BackgroundAndPurpose";
import Sec02_Definitions from "./data/SLA_Contents/Sec02_Definitions";
import Sec03_GrantOfLicense from "./data/SLA_Contents/Sec03_GrantOfLicense";
import Sec04_OwnershipAndIP from "./data/SLA_Contents/Sec04_OwnershipAndIP";
import Sec05_LicenseFeeAndRenewal from "./data/SLA_Contents/Sec05_LicenseFeeAndRenewal";
import Sec06_UsageConditions from "./data/SLA_Contents/Sec06_UsageConditions";
import Sec07_SupervisedHostingException from "./data/SLA_Contents/Sec07_SupervisedHostingException";
import Sec08_SystemMonitoringAndLogging from "./data/SLA_Contents/Sec08_SystemMonitoringAndLogging";
import Sec09_CodeProtection from "./data/SLA_Contents/Sec09_CodeProtection";
import Sec10_BrandUsageDisclaimer from "./data/SLA_Contents/Sec10_BrandUsageDisclaimer";
import Sec11_LegalStatusOfDeveloper from "./data/SLA_Contents/Sec11_LegalStatusOfDeveloper";
import Sec12_DigitalAcceptance from "./data/SLA_Contents/Sec12_DigitalAcceptance";
import Sec13_SystemExpirationAndUIBehavior from "./data/SLA_Contents/Sec13_SystemExpirationAndUIBehavior";
import Sec14_BreachAndTermination from "./data/SLA_Contents/Sec14_BreachAndTermination";
import Sec15_DisputeResolution from "./data/SLA_Contents/Sec15_DisputeResolution";
import Sec16_MaintenanceDisclaimer from "./data/SLA_Contents/Sec16_MaintenanceDisclaimer";
import Sec17_Confidentiality from "./data/SLA_Contents/Sec17_Confidentiality";
import Sec18_NonTransferability from "./data/SLA_Contents/Sec18_NonTransferability";
import Sec19_LicenseVerification from "./data/SLA_Contents/Sec19_LicenseVerification";
import Sec20_IncidentReporting from "./data/SLA_Contents/Sec20_IncidentReporting";
import Sec21_GeneralProvisions from "./data/SLA_Contents/Sec21_GeneralProvisions";
import Sec22_ContactInformation from "./data/SLA_Contents/Sec22_ContactInformation";
import Sec23_AcceptanceAndExecution from "./data/SLA_Contents/Sec23_AcceptanceAndExecution";
import Sec24_SupersessionOfPriorDrafts from "./data/SLA_Contents/Sec24_SupersessionOfPriorDrafts";
import type { Route } from "./+types/WrapperLayout";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "KPC | Software License Agreement" },
    { name: "description", content: "Welcome to React Router!" }
  ];
}

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
                <Sec07_SupervisedHostingException />
                <Sec08_SystemMonitoringAndLogging />
                <Sec09_CodeProtection />
                <Sec10_BrandUsageDisclaimer />
                <Sec11_LegalStatusOfDeveloper />
                <Sec12_DigitalAcceptance />
                <Sec13_SystemExpirationAndUIBehavior />
                <Sec14_BreachAndTermination />
                <Sec15_DisputeResolution />
                <Sec16_MaintenanceDisclaimer />
                <Sec17_Confidentiality />
                <Sec18_NonTransferability />
                <Sec19_LicenseVerification />
                <Sec20_IncidentReporting />
                <Sec21_GeneralProvisions />
                <Sec22_ContactInformation />
                <Sec23_AcceptanceAndExecution />
                <Sec24_SupersessionOfPriorDrafts />
              </article>

              <div className="segment">
                <p>
                  <span className="font-semibold">
                    Official License Record:
                  </span>
                  <br />
                  <a
                    href="https://clients.clementfranz.site/licences/CFZ-KBNRDS-LICENSE-V1.0-20250525"
                    className="text-blue-600 underline break-all"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    https://clients.clementfranz.site/licences/CFZ-KBNRDS-LICENSE-V1.0-20250525
                  </a>
                </p>

                <p className="mt-2">
                  <span className="font-semibold">Document ID:</span>{" "}
                  <span className="font-bold">
                    CFZ-KBNRDS-LICENSE-V1.0-20250525
                  </span>
                </p>

                <p className="mt-2">
                  QR code for verification is attached with the digital copy.
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
