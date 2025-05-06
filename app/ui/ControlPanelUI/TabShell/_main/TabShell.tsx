import React from "react";
import type { ReactNode } from "react";

type TabShellProps = {
  position: "top" | "bottom";
  children: ReactNode;
  className?: string;
};

const TabShell = ({ position, children, className }: TabShellProps) => {
  return (
    <>
      {position === "top" ? (
        <div
          className={`top-part flex flex-col grow overflow-hidden ${className}`}
        >
          <div
            className={`flex bg-gradient-to-b from-gray-900 to-gray-800 h-0 grow overflow-y-scroll w-full flex-col  p-4 `}
          >
            {children}
          </div>
        </div>
      ) : (
        <div className="bottom-part flex justify-between items-center text-sm">
          <div
            className={`flex bg-gray-800 w-full justify-between items-center  p-4 `}
          >
            {children}
          </div>
        </div>
      )}
    </>
  );
};

export default TabShell;
