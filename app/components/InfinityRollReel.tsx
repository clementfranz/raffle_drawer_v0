import React from "react";

interface InfinityRollReelProps {
  characters: string[];
}

const InfinityRollReel: React.FC<InfinityRollReelProps> = ({ characters }) => {
  return (
    <div className="slot-reel-infiroll  flex flex-col w-full align-center justify-center absolute top-0 left-0">
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
