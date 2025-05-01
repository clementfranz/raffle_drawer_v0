import React, { type ReactNode } from "react";

type UploadBoxFooterProps = {
  className?: string;
  children?: ReactNode;
};

const UploadBoxFooter = ({ children, className }: UploadBoxFooterProps) => {
  return <div className={`w-full ${className}`}>{children}</div>;
};

export default UploadBoxFooter;
