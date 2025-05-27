import React from "react";

const Sec20_IncidentReporting = () => {
  return (
    <section>
      <div className="segment">
        <h1>20. Incident Reporting</h1>
      </div>

      <div className="segment indented">
        <h2>20.1 Third-Party Exposure</h2>
        <p>
          Failure to report such incidents within 48 hours of occurrence may
          result in:
        </p>
        <ul className="">
          <li>Temporary suspension of system access pending investigation</li>
          <li>Permanent termination of the license</li>
          <li>
            Legal claims for breach of license terms and intellectual property
            violation
          </li>
        </ul>
      </div>

      <div className="segment indented">
        <h2>20.2 Resolution Process</h2>
        <p>
          If such an incident is reported, the Developer and Licensee will
          initiate a transparent discussion. The Developer may impose one of the
          following remedies based on severity:
        </p>
        <ul className="">
          <li>A written warning with continued use</li>
          <li>Additional licensing or partnership agreement</li>
          <li>Mandatory supervision or co-hosting by the Developer</li>
          <li>Termination of the license</li>
        </ul>
      </div>
    </section>
  );
};

export default Sec20_IncidentReporting;
