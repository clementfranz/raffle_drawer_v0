import React from "react";

const MobileBlockerUI = () => {
  return (
    <div>
      <h1>📱 Mobile Device Detected</h1>
      <p>We're sorry.</p>
      <p>
        This website is only available and can be opened on a desktop device.
      </p>
      <p>We blocked all rendering to prevent bad user interface.</p>
    </div>
  );
};

export default MobileBlockerUI;
