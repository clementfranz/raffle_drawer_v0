import React, { type ReactNode } from "react";

type UploadBoxBodyProps = {
  children?: ReactNode;
  className?: string;
};

const UploadBoxBody = ({ children, className }: UploadBoxBodyProps) => {
  return <div className={`grow bg-green h-0 ${className}`}>{children}</div>;
};

export default UploadBoxBody;
