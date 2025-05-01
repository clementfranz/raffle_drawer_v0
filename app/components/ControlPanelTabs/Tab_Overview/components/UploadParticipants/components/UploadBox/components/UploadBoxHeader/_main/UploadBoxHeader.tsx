import React, { type ReactNode } from "react";

type UploadBoxHeaderProps = {
  children: ReactNode;
};

const UploadBoxHeader = ({ children }: UploadBoxHeaderProps) => {
  return (
    <div className="upload-box-header text-lg  w-full mb-4">{children}</div>
  );
};

export default UploadBoxHeader;
