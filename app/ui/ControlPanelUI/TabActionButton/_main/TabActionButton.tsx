import React, { type ReactNode } from "react";

type TabActionButtonProps = {
  className?: string; // optional, no nulls needed
  onClick?: () => void; // optional, no nulls needed
  children: ReactNode;
};

const TabActionButton = ({
  children,
  onClick,
  className = "" // default to empty string if not provided
}: TabActionButtonProps) => {
  return (
    <button
      className={`bg-gray-600 hover:bg-gray-500 px-4 h-[40px] rounded-2xl cursor-pointer ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default TabActionButton;
