import React from "react";

import UploadButton from "../../UploadButton/_main/UploadButton";

const Phase01_Idle = () => {
  return <div>Phase01_Idle</div>;
};

const Header = () => {
  return (
    <div>
      Drag and drop a CSV file here <br /> or click button below to upload
    </div>
  );
};

const Body = () => {
  return (
    <>
      Upload a CSV file with the participants data. The file should contain the
      following columns: Entry ID, Full Name, Raffle Code, Region/Location.
    </>
  );
};

const Footer = () => {
  return (
    <>
      <UploadButton>Select & Attach File</UploadButton>
    </>
  );
};

Phase01_Idle.Header = Header;
Phase01_Idle.Body = Body;
Phase01_Idle.Footer = Footer;

export default Phase01_Idle;
