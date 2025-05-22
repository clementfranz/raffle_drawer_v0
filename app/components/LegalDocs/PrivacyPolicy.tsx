import React from "react";

const PrivacyPolicy = () => {
  return (
    <div className="relative py-5 mt-5">
      <div className="title text-white py-4 text-3xl uppercase font-bold text-center w-full sticky top-0 bg-[#000000ce]">
        Privacy Policy
      </div>
      <div className="content p-5 bg-[#ffffffad]">
        <div className="privacy-policy p-6 max-w-4xl mx-auto text-gray-800">
          <h1 className="text-3xl font-bold mb-4 hidden">Privacy Policy</h1>
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
            (may change to a subdomain like <code>rds.kpc.com.ph</code> in the
            future)
          </p>
          <p className="mb-6">Document Version: 1.0</p>

          <h2 className="text-xl font-semibold mt-6 mb-2">1. Overview</h2>
          <p className="mb-4">
            This Privacy Policy explains how Vouno Marketing Inc. (“we”, “our”,
            “the Company”) collects, uses, and protects your information when
            using our internal raffle draw application (“the App”), accessible
            only to authorized employees of the Company via Google login. The
            raffle system is used exclusively for conducting legally approved
            national promotional draws for Kopiko Blanca, certified and
            witnessed by relevant authorities including the DTI.
          </p>

          <h2 className="text-xl font-semibold mt-6 mb-2">2. Scope</h2>
          <p className="mb-4">
            This policy applies only to authorized system users (employees) who
            log in using their Google account. The app is not available to the
            public, nor to minors, and does not run any form of advertisement.
            It is for internal company use only.
          </p>

          <h2 className="text-xl font-semibold mt-6 mb-2">
            3. Information We Collect
          </h2>
          <p className="mb-2">
            When logging into the system via Google OAuth, we collect the
            following information:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>Full name</li>
            <li>Email address</li>
            <li>Profile picture (if available)</li>
          </ul>

          <p className="mb-2">
            Additionally, participant data uploaded by Vouno Marketing includes:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>Registration date</li>
            <li>Full name of participant</li>
            <li>
              General region (e.g., Northern Luzon, Visayas, Metro Manila)
            </li>
            <li>Unique raffle draw code (found on product packaging)</li>
          </ul>

          <p className="mb-4">
            This data is used solely for generating winners and is deleted after
            each session except for winners and backups.
          </p>

          <h2 className="text-xl font-semibold mt-6 mb-2">
            4. How We Use Your Information
          </h2>
          <ul className="list-disc pl-6 mb-4">
            <li>Authenticate your identity as an authorized user</li>
            <li>Display your name for admin logs and activity tracking</li>
            <li>Verify license and feature access</li>
          </ul>
          <p className="mb-4">
            OAuth data is not used for marketing or shared externally.
            Participant data is used exclusively for draw management.
          </p>

          <h2 className="text-xl font-semibold mt-6 mb-2">
            5. Data Sharing & Disclosure
          </h2>
          <ul className="list-disc pl-6 mb-4">
            <li>We do not sell, rent, or trade your personal data.</li>
            <li>Access is limited to the Company and authorized personnel.</li>
            <li>
              Winner names may be published on the official Kopiko Facebook page
              (with participant consent).
            </li>
          </ul>

          <h2 className="text-xl font-semibold mt-6 mb-2">6. Data Retention</h2>
          <ul className="list-disc pl-6 mb-4">
            <li>Participant entries are deleted after every session.</li>
            <li>
              Only draw results (winners and backups) are retained for
              compliance.
            </li>
            <li>
              OAuth login data is retained as long as your access is active.
            </li>
          </ul>

          <h2 className="text-xl font-semibold mt-6 mb-2">7. Security</h2>
          <ul className="list-disc pl-6 mb-4">
            <li>Encrypted storage</li>
            <li>Role-based access control</li>
            <li>System monitoring and auditing</li>
            <li>Limited access for authorized personnel only</li>
          </ul>

          <h2 className="text-xl font-semibold mt-6 mb-2">
            8. User Rights and Access
          </h2>
          <p className="mb-2">
            You may request the following by writing to the Company:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>Access to stored login data</li>
            <li>Correction of inaccurate data</li>
            <li>Removal of your Google login upon system exit</li>
          </ul>

          <h2 className="text-xl font-semibold mt-6 mb-2">
            9. Changes to This Privacy Policy
          </h2>
          <p className="mb-4">
            We may update this Privacy Policy from time to time. Significant
            changes will be announced via internal communication or system
            prompts. The latest version will be available at the official app
            domain.
          </p>

          <h2 className="text-xl font-semibold mt-6 mb-2">
            10. Contact Information
          </h2>
          <p>
            For questions, please contact:
            <br />
            Vouno Marketing Inc.
            <br />
            Legal and Compliance Department
            <br />
            [Insert contact email or phone number]
            <br />
            [Insert physical address]
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
