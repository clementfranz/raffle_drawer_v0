import React from "react";

const Sec13_SystemExpirationAndUIBehavior = () => {
  return (
    <section id="section-13">
      <div className="segment">
        <h1>13. System Expiration and UI Behavior</h1>
      </div>

      <div className="segment indented">
        <h2>13.1 Expiration Handling:</h2>
        <ul>
          <li>
            <b>3 Months Before Expiration:</b> A dismissible warning banner will
            appear in the UI.
          </li>
          <li>
            <b>1 Month Before Expiration:</b> The system navbar will display the
            expiration deadline permanently.
          </li>
          <li>
            <b>7 Days Before Expiration:</b> A full-screen warning will appear
            at every startup, and the navbar will display a real-time countdown.
          </li>
          <li>
            <b>Upon Expiration (May 25, 2026, 12:00 AM):</b> The entire System
            UI will be fully blocked, displaying a lock screen with license
            expiration notice, Developer contact details, and instructions for
            renewal inquiry.
          </li>
        </ul>
      </div>
    </section>
  );
};

export default Sec13_SystemExpirationAndUIBehavior;
