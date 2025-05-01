import React from "react";
import type { ReactNode } from "react";

type TabShellProps = {
  position: "top" | "bottom";
  children: ReactNode;
};

const TabShell = ({ position, children }: TabShellProps) => {
  return (
    <>
      {position === "top" ? (
        <div className="top-part bg-amber-400 flex flex-col grow overflow-hidden">
          <div className="flex p-4 bg-gradient-to-b from-gray-900 to-gray-800 h-0 grow overflow-y-scroll w-full flex-col">
            {children}
          </div>
        </div>
      ) : (
        <div className="bottom-part flex justify-between items-center text-sm p-4">
          {children}
        </div>
      )}
    </>
  );
};

export default TabShell;
