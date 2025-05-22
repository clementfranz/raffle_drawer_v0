import React from "react";

const TermsAndCondition = () => {
  return (
    <div className="relative py-5 mt-5">
      <div className="title text-white py-4 text-3xl uppercase font-bold text-center w-full sticky top-0 bg-[#000000ce]">
        Terms & Conditions
      </div>
      <div className="content p-5 bg-[#ffffffad]">
        <div className="terms-and-conditions p-6 max-w-4xl mx-auto text-gray-800">
          <h1 className="text-3xl font-bold mb-4 hidden">
            Terms and Conditions
          </h1>
          <p className="mb-2">
            Effective Date: <em>[Insert Date]</em>
          </p>
          <p className="mb-2">
            Official URL:{" "}
            <a
              href="https://www.kpc.com.ph"
              className="text-blue-600 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              https://www.kpc.com.ph
            </a>{" "}
            (subject to change to <code>rds.kpc.com.ph</code> or another
            subdomain)
          </p>
          <p className="mb-6">Document Version: 1.0</p>

          <h2 className="text-xl font-semibold mt-6 mb-2">
            1. Acceptance of Terms
          </h2>
          <p className="mb-4">
            By accessing or using the raffle draw system (“the App”), you agree
            to be bound by these Terms and Conditions. If you do not agree, you
            are not authorized to use this system. The App is owned and
            maintained by Vouno Marketing Inc. (“the Company”). It is for
            internal use only by authorized Company employees for conducting
            legally approved Kopiko Blanca promotional raffle draws.
          </p>

          <h2 className="text-xl font-semibold mt-6 mb-2">2. Eligibility</h2>
          <ul className="list-disc pl-6 mb-4">
            <li>Verified employees of the Company</li>
            <li>
              Users granted access by the Company’s raffle operations team
            </li>
          </ul>
          <p className="mb-4">
            Minors and the public are not permitted to use this system.
          </p>

          <h2 className="text-xl font-semibold mt-6 mb-2">
            3. Purpose of the App
          </h2>
          <ul className="list-disc pl-6 mb-4">
            <li>Managing participant data (imported from Facebook chatbot)</li>
            <li>Randomizing raffle entries and selecting winners</li>
            <li>Logging draw history and results</li>
            <li>Verifying winner eligibility and backups</li>
          </ul>
          <p className="mb-4">
            Each draw is certified by the DTI and witnessed by authorized
            representatives of both DTI and Kopiko.
          </p>

          <h2 className="text-xl font-semibold mt-6 mb-2">
            4. OAuth Login and User Information
          </h2>
          <p className="mb-2">
            When logging in via Google, the system collects:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>Full name</li>
            <li>Email address</li>
            <li>Profile picture (if available)</li>
          </ul>
          <p className="mb-4">
            This data is used solely for access tracking and system integrity.
            It is not used for marketing or shared externally.
          </p>

          <h2 className="text-xl font-semibold mt-6 mb-2">
            5. Participant Data Handling
          </h2>
          <p className="mb-2">
            Participant data from Facebook chatbot includes:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>Registration date</li>
            <li>Full name</li>
            <li>
              General region (e.g., Northern Luzon, Visayas, Metro Manila)
            </li>
            <li>Raffle draw code (from product packaging)</li>
          </ul>
          <p className="mb-4">
            This data is managed exclusively by the Company’s raffle team.
          </p>

          <h2 className="text-xl font-semibold mt-6 mb-2">
            6. Draw Process & Winner Selection
          </h2>
          <p className="mb-2">Per draw, the system randomly selects:</p>
          <ul className="list-disc pl-6 mb-4">
            <li>One primary winner</li>
            <li>Three backup winners</li>
          </ul>
          <p className="mb-4">
            If the primary winner is unavailable, a backup winner may be
            promoted. All draws are logged and conducted using verified
            randomized algorithms.
          </p>

          <h2 className="text-xl font-semibold mt-6 mb-2">
            7. Data Deletion & Retention
          </h2>
          <ul className="list-disc pl-6 mb-4">
            <li>Participant entries are deleted after each session</li>
            <li>Winner records are retained for compliance and auditing</li>
            <li>
              Google login data is retained only while your access is active
            </li>
          </ul>

          <h2 className="text-xl font-semibold mt-6 mb-2">
            8. Winner Publication
          </h2>
          <p className="mb-4">
            During chatbot registration, participants consent that if they win,
            their full name may be published on the official Kopiko Facebook
            page, in accordance with data privacy laws.
          </p>

          <h2 className="text-xl font-semibold mt-6 mb-2">
            9. Prohibited Conduct
          </h2>
          <ul className="list-disc pl-6 mb-4">
            <li>Misusing login credentials or impersonating others</li>
            <li>Modifying or tampering with raffle results</li>
            <li>Attempting to reverse-engineer the system</li>
            <li>Using outdated or unauthorized versions to bypass features</li>
          </ul>
          <p className="mb-4">
            Violations may result in access revocation and legal action under
            the Software License Agreement (SLA).
          </p>

          <h2 className="text-xl font-semibold mt-6 mb-2">
            10. System Integrity and License
          </h2>
          <p className="mb-4">
            This system is governed by a Software License Agreement between the
            Company and the developer. Only valid and up-to-date licenses
            authorize system use. Circumventing these terms is strictly
            prohibited.
          </p>

          <h2 className="text-xl font-semibold mt-6 mb-2">
            11. Limitation of Liability
          </h2>
          <p className="mb-4">
            The system is provided “as is” without warranties. The Company is
            not liable for indirect or incidental damages caused by usage or
            failure.
          </p>

          <h2 className="text-xl font-semibold mt-6 mb-2">
            12. Modifications to Terms
          </h2>
          <p className="mb-4">
            The Company reserves the right to update these terms. Changes will
            be communicated via internal messages or system prompts. Continued
            use indicates acceptance.
          </p>

          <h2 className="text-xl font-semibold mt-6 mb-2">
            13. Contact Information
          </h2>
          <p>
            For questions, contact:
            <br />
            Vouno Marketing Inc.
            <br />
            Legal and Compliance Department
            <br />
            [Insert contact email / phone]
            <br />
            [Insert physical address]
          </p>
        </div>
      </div>
    </div>
  );
};

export default TermsAndCondition;
