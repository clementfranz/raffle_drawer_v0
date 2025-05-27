import React from "react";

const Sec19_LicenseVerification = () => {
  return (
    <section>
      <div className="segment">
        <h1>19. License Verification</h1>
      </div>

      <div className="segment indented">
        <h2>19.1 QR Code</h2>
        <p>
          A QR code is embedded with this license document. When scanned, it
          links to a secure verification page:
          <br />
          <a
            href="https://clients.clementfranz.site/licences/CFZ-KBNRDS-LICENSE-V1.0-20250525"
            className="text-blue-600 underline py-3 flex"
            target="_blank"
            rel="noopener noreferrer"
          >
            https://clients.clementfranz.site/licences/CFZ-KBNRDS-LICENSE-V1.0-20250525
          </a>
        </p>
        <p>This page confirms the authenticity of this license, including:</p>
        <ul className="">
          <li>Licensee's name</li>
          <li>Activation and expiration dates</li>
          <li>Status (Active, Expiring, or Expired)</li>
          <li>Additional notes from Developer (if applicable)</li>
        </ul>
        <p>
          Document ID: <b>CFZ-KBNRDS-LICENSE-V1.0-20250525</b>
        </p>
        <p>
          Any tampering or replacement of this license document will not affect
          the official record hosted at the link above.
        </p>
      </div>
    </section>
  );
};

export default Sec19_LicenseVerification;
