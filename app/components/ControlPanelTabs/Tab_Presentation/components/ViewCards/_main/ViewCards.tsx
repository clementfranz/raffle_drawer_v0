import React from "react";

type ViewCardsProps = {
  children?: React.ReactNode;
  onClick?: () => void;
  className?: string;
  thumbnailUrl?: string;
  imageFile?: File;
};

const ViewCards = ({
  children,
  onClick,
  className = "",
  thumbnailUrl = ""
}: ViewCardsProps) => {
  return (
    <div
      className={`view-option rounded-md aspect-video flex justify-center items-end text-sm bg-cover bg-center transition-all duration-500 ${className}`}
      style={{
        backgroundImage: thumbnailUrl ? `url(${thumbnailUrl})` : undefined
      }}
      onClick={onClick}
    >
      <div className="label">{children}</div>
    </div>
  );
};

export default ViewCards;
