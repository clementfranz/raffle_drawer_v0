import React, { useState, useEffect } from "react";

type LazyBgProps = {
  hdUrl: string;
  blurUrl: string;
  className?: string;
  children?: React.ReactNode;
};

const LazyBackground: React.FC<LazyBgProps> = ({
  hdUrl,
  blurUrl,
  className = "",
  children
}) => {
  const [isHdLoaded, setIsHdLoaded] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.src = hdUrl;
    img.onload = () => setIsHdLoaded(true);
  }, [hdUrl]);

  return (
    <div className={`relative  overflow-hidden h-screen w-screen ${className}`}>
      {/* Blurred Background */}
      <div
        className="absolute inset-0 bg-cover bg-center filter blur-sm scale-120 transition-opacity duration-500"
        style={{ backgroundImage: `url(${blurUrl})` }}
      />
      {/* HD Background */}
      <div
        className={`absolute inset-0 bg-cover bg-center transition-all duration-500 overflow-hidden ${
          isHdLoaded ? "opacity-100 scale-100" : "opacity-0 scale-120"
        }`}
        style={{ backgroundImage: `url(${hdUrl})` }}
      />
      {/* Content */}
      <div className="relative z-10 w-screen flex h-screen">{children}</div>
    </div>
  );
};

export default LazyBackground;
