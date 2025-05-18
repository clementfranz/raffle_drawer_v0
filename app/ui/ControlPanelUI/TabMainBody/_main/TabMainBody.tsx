import React, { type ReactNode } from "react";

type TabMainBodyProps = {
  isActive?: boolean;
  children: ReactNode;
  className?: string;
};

const TabMainBody = ({
  isActive = false,
  children,
  className
}: TabMainBodyProps) => {
  return (
    <div
      className={`w-full flex-col justify-between relative   text-white grow ${
        isActive ? "flex" : "hidden"
      } ${className}`}
    >
      {children}
    </div>
  );
};

export default TabMainBody;
