import React from "react";

const Sec08_SystemMonitoringAndLogging = () => {
  return (
    <section>
      <div className="segment">
        <h1>8. System Monitoring and Logging</h1>
      </div>

      <div className="segment indented">
        <h2>8.1 Logging Mechanisms:</h2>
        <p>
          The System includes internal logs connected to the Developer’s private
          API, limited to:
        </p>
        <ul>
          <li>Technical diagnostics</li>
          <li>License verification</li>
          <li>Uptime and activity tracking</li>
        </ul>
      </div>

      <div className="segment indented">
        <h2>8.2 Brand Usage Monitoring:</h2>
        <p>
          The System logs raffle names, draw schedules, and remarks entered by
          the Licensee to determine brand affiliation. Unauthorized use for
          other brands may trigger a license audit warning.
        </p>
      </div>
    </section>
  );
};

export default Sec08_SystemMonitoringAndLogging;
