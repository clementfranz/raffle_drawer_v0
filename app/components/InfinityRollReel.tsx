import React from "react";

interface InfinityRollReelProps {
  characters: string[];
  isRollingStart?: boolean;
  isRollingEnd?: boolean;
  delayReveal?: number;
}

const InfinityRollReel: React.FC<InfinityRollReelProps> = ({
  characters,
  isRollingStart,
  delayReveal = 0
}) => {
  return (
    <div
      className={`slot-reel-infiroll  flex-col w-full align-center justify-center absolute top-0 left-0 transition-all duration-1000 ease-out ${
        isRollingStart ? "opacity-100" : "opacity-0"
      }`}
      style={{
        transitionDelay: `${isRollingStart ? 0 : delayReveal * 0.5}s`
      }}
    >
      <div className="reel-part-a">
        {characters.map((char, index) => (
          <div
            key={index}
            className="slot-reel-item w-full aspect-square  flex justify-center items-center"
            style={{
              animationDelay: `${index * 0.81416}s`
            }}
          >
            {char}
          </div>
        ))}
      </div>
      <div className="reel-part-b">
        {characters.map((char, index) => (
          <div
            key={index}
            className="slot-reel-item w-full aspect-square  flex justify-center items-center"
            style={{
              animationDelay: `${index * 0.81416}s`
            }}
          >
            {char}
          </div>
        ))}
      </div>
    </div>
  );
};

export default InfinityRollReel;
