import React, { useState } from "react";

type LazyImageProps = {
  src: string; // HD image
  placeholder: string; // Blurred image
  alt?: string;
  className?: string;
};

const LazyImage: React.FC<LazyImageProps> = ({
  src,
  placeholder,
  alt = "",
  className = ""
}) => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className={`relative w-full overflow-hidden ${className}`}>
      <img
        src={placeholder}
        alt={alt}
        className="w-full blur-sm scale-105 transition-opacity duration-500 absolute top-0 left-0"
      />
      <img
        src={src}
        alt={alt}
        onLoad={() => setIsLoaded(true)}
        className={`w-full transition-opacity duration-500 absolute top-0 left-0 ${
          isLoaded ? "opacity-100" : "opacity-0"
        }`}
      />
    </div>
  );
};

export default LazyImage;
