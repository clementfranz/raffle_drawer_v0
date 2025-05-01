import React, { type ReactNode } from "react";

type TabMainBodyProps = {
  isActive?: boolean;
  children: ReactNode;
};

const TabMainBody = ({ isActive = false, children }: TabMainBodyProps) => {
  return (
    <div
      className={`w-full flex-col justify-between  text-white grow ${
        isActive ? "flex" : "hidden"
      }`}
    >
      {children}
    </div>
  );
};

export default TabMainBody;
