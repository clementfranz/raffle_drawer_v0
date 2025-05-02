import React, { type ReactNode } from "react";

type UploadBoxHeaderProps = {
  children?: ReactNode;
  className?: string;
};

const UploadBoxHeader = ({ children, className }: UploadBoxHeaderProps) => {
  return (
    <div className={`upload-box-header text-lg  w-full mb-4 ${className}`}>
      {children}
    </div>
  );
};

export default UploadBoxHeader;
