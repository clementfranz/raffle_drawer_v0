import React, { type ReactNode } from "react";

type UploadButtonProps = {
  className?: string;
  onClick?: () => void;
  children: ReactNode;
};

const defaultStyling =
  "bg-gray-600 hover:bg-gray-500 px-4 h-[40px] w-full text-center rounded-xl cursor-pointer mt-2 flex items-center justify-center gap-2";

const UploadButton = ({ className, children, onClick }: UploadButtonProps) => {
  return (
    <button className={`${defaultStyling} ${className}`} onClick={onClick}>
      {children}
    </button>
  );
};

export default UploadButton;
