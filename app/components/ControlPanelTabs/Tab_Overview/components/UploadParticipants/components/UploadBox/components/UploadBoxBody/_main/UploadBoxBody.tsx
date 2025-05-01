import React, { type ReactNode } from "react";

type UploadBoxBodyProps = {
  children?: ReactNode;
};

const UploadBoxBody = ({ children }: UploadBoxBodyProps) => {
  return <div className="grow bg-green h-0">{children}</div>;
};

export default UploadBoxBody;
