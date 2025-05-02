import React, { type ReactNode } from "react";

type UploadButtonProps = {
  className?: string;
  onClick?: () => void;
  children?: ReactNode;
  clickable?: boolean;
};

const defaultStyling =
  "bg-gray-600 px-4 h-[40px] w-full text-center rounded-xl  mt-2 flex items-center justify-center gap-2";

const UploadButton = ({
  className,
  children,
  onClick,
  clickable = true
}: UploadButtonProps) => {
  const clickableStyling = clickable ? "cursor-pointer hover:bg-gray-500" : "";

  return (
    <button
      className={`${defaultStyling} ${className} ${clickableStyling}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default UploadButton;
