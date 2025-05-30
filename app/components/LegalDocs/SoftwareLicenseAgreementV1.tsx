import React from "react";
import { useAuth } from "~/auth/AuthContext";

const SoftwareLicenseAgreementV1 = () => {
  const { user } = useAuth();
  return (
    <div className="max-w-4xl mx-auto py-8 bg-white/80 shadow-xl  text-gray-800 text-sm leading-relaxed space-y-6 relative">
      <h1 className="text-2xl font-bold text-center mb-6 py-5 bg-black/60 text-white sticky top-0">
        Software License Agreement:
      </h1>

      <div className="px-8">
        <div>
          <p>
            <strong>Effective Date:</strong> May 30, 2025
          </p>
          <p>
            <strong>Software/Product Name:</strong> Kopiko Blanca - National
            Raffle Draw System
          </p>
        </div>

        <div>
          <h2 className="text-lg font-semibold mt-4">Developer (Licensor):</h2>
          <p className="ml-4">
            Clement Francis Delos Santos
            <br />
            Independent Freelance Software Developer
            <br />
            📧 Email:{" "}
            <a
              href="mailto:delossantos.clementfrancis@gmail.com"
              className="text-blue-600 underline"
            >
              delossantos.clementfrancis@gmail.com
            </a>
            <br />
            📞 Phone: 0977-791-9318 / 0992-706-1517
          </p>
        </div>

        <div>
          <h2 className="text-lg font-semibold mt-4">Licensee:</h2>
          <p className="ml-4">
            Kevin Conrado
            <br />
            Employee of Vouno Trade and Marketing Services Corporation
            <br />
            (Engaging in a personal capacity as client for a side project)
            <br />
            📧 Email:{" "}
            <a
              href="mailto:kevin.conrado@vouno.com.ph"
              className="text-blue-600 underline"
            >
              kevin.conrado@vouno.com.ph
            </a>
            <br />
            📞 Phone: 0917-509-6733
          </p>
        </div>

        <ol className="space-y-4 list-decimal list-inside mt-8">
          <li>
            <strong className="text-lg">Grant of License</strong>
            <br />
            The Licensor grants the Licensee a non-exclusive, non-transferable,
            revocable license to use the Software for private internal viewing
            purposes only, strictly limited to content and data related to the
            Kopiko Blanca product. No use related to any other products or
            projects of the Licensee’s employer or third parties is permitted.
          </li>

          <li>
            <strong className="text-lg">Scope of Use</strong>
            <br />
            The Software may only be used for private internal viewing.
            <br />
            Public, commercial, or enterprise-wide deployment is not allowed.
            <br />
            Redistribution, sublicensing, or any form of sharing beyond the
            Licensee's direct access is prohibited.
          </li>

          <li>
            <strong className="text-lg">Ownership</strong>
            <br />
            This Software is licensed, not sold. All rights, title, and
            intellectual property remain the exclusive property of the
            Developer.
          </li>

          <li>
            <strong className="text-lg">Compatibility and Maintenance</strong>
            <br />
            Browser technologies and dependencies evolve. Continued
            functionality is not guaranteed without updates. Issues arising from
            unmaintained versions or deprecated technologies fall outside the
            scope of this license.
          </li>

          <li>
            <strong className="text-lg">
              Updates and Future Modifications
            </strong>
            <br />
            The Licensor may release new versions to ensure security and
            compatibility. The Licensee understands that updates may become
            necessary to ensure the Software continues to operate with modern
            browsers and environments.
          </li>

          <li>
            <strong className="text-lg">Deprecation and Limitations</strong>
            <br />
            Artificial timeouts or version expirations may be introduced to
            ensure that only updated, secure versions are in use. The Licensee
            agrees that future updates or new versions may contain different
            terms and that continued use will require consent to such terms.
          </li>

          <li>
            <strong className="text-lg">Non-Perpetual Use</strong>
            <br />
            This license is not perpetual. Use of the Software may become
            limited or disabled if dependencies become outdated, vulnerabilities
            arise, or updated terms are required.
          </li>

          <li>
            <strong className="text-lg">
              Accountability & Scope Limitation
            </strong>
            <br />
            The Licensee, Mr. Kevin Conrado, affirms that this software is
            acquired in a personal capacity. The Licensor holds no liability or
            obligation to Vouno Trade and Marketing Services Corporation. Any
            corporate risks, exposure, or implications rest solely on the
            Licensee, not the Licensor.
          </li>

          <li>
            <strong className="text-lg">Termination</strong>
            <br />
            This agreement will terminate if the Licensee violates any clause.
            Upon termination, access to the Software must cease and any copies
            must be deleted.
          </li>

          <li>
            <strong className="text-lg">Disclaimer of Warranty</strong>
            <br />
            This Software is provided “as-is.” The Developer offers no warranty
            as to performance or suitability for any business or operational
            use.
          </li>

          <li>
            <strong className="text-lg">Limitation of Liability</strong>
            <br />
            To the maximum extent permitted by law, the Developer shall not be
            liable for any damages, including incidental or consequential
            damages, arising from the use or inability to use the Software.
          </li>

          <li>
            <strong className="text-lg">Governing Law</strong>
            <br />
            This Agreement shall be governed by the laws of the Republic of the
            Philippines.
          </li>

          <li>
            <strong className="text-lg">Entire Agreement</strong>
            <br />
            This document constitutes the entire agreement between the parties,
            superseding all prior negotiations or understandings.
          </li>
        </ol>

        <div className="text-center pt-6 text-sm italic text-gray-600">
          By using the Software, the Licensee affirms understanding and
          acceptance of this Agreement in full.
        </div>
      </div>
    </div>
  );
};

export default SoftwareLicenseAgreementV1;
