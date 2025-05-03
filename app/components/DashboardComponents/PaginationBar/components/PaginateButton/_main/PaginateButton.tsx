// PaginateButton.tsx
import React from "react";

interface PaginateButtonProps {
  page: number | string;
  isActive: boolean;
  onClick: (page: number) => void;
}

const PaginateButton: React.FC<PaginateButtonProps> = ({
  page,
  isActive,
  onClick
}) => {
  if (page === "...") {
    return <span className="px-2 select-none">...</span>;
  }

  return (
    <span
      className={`cursor-pointer px-2 hover:text-white!  ${
        isActive
          ? "active font-bold text-white! bg-[#914f03] text-base!"
          : "text-gray-700!"
      }`}
      onClick={() => onClick(Number(page))}
    >
      {page}
    </span>
  );
};

export default PaginateButton;
