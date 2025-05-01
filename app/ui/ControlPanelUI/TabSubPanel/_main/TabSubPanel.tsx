import React, { type ReactNode } from "react";

type TabSubPanelProps = {
  title: string;
  className?: string;
  children?: ReactNode;
};

const TabSubPanel = ({ title, children, className }: TabSubPanelProps) => {
  return (
    <>
      <div className={`sub-panel mb-3 ${className}`}>
        <h2 className="mb-2">{title}</h2>
        {children}
      </div>
    </>
  );
};

export default TabSubPanel;
