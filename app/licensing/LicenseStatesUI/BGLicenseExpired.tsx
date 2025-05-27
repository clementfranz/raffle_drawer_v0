import React, { useEffect, useMemo } from "react";
import "./BGLicenseExpired.css";

const BGLicenseExpired = () => {
  useEffect(() => {
    const preventDefault = (e: Event) => e.preventDefault();

    window.addEventListener("contextmenu", preventDefault);
    window.addEventListener("keydown", preventDefault);
    window.addEventListener("mousedown", preventDefault);
    window.addEventListener("touchstart", preventDefault);

    return () => {
      window.removeEventListener("contextmenu", preventDefault);
      window.removeEventListener("keydown", preventDefault);
      window.removeEventListener("mousedown", preventDefault);
      window.removeEventListener("touchstart", preventDefault);
    };
  }, []);

  const repeatCount = 24; // Reduced for performance
  const rows = 8;
  const cols = 8;

  const floatingMessages = useMemo(() => {
    const usedPositions = new Set<string>();

    const getUniqueGridPos = () => {
      let pos: string;
      do {
        const row = Math.floor(Math.random() * rows);
        const col = Math.floor(Math.random() * cols);
        pos = `${row},${col}`;
      } while (usedPositions.has(pos));
      usedPositions.add(pos);
      const [row, col] = pos.split(",").map(Number);
      return {
        topOffset: (row / rows) * 100,
        leftOffset: (col / cols) * 100
      };
    };

    return Array.from({ length: repeatCount }).map(() => {
      const delay = Math.random() * 20;
      const duration = 6 + Math.random() * 6;
      const { topOffset, leftOffset } = getUniqueGridPos();

      return { delay, duration, topOffset, leftOffset };
    });
  }, []);

  return (
    <div className="bg-gray-950 text-white h-screen w-screen overflow-hidden relative font-[Montserrat]">
      {/* Floating Messages */}
      {floatingMessages.map(({ delay, duration, topOffset, leftOffset }, i) => (
        <div
          key={i}
          className="absolute text-center pointer-events-none bg-fade scrolling"
          style={{
            animationDelay: `${delay}s`,
            animationDuration: `${duration}s, ${duration + 10}s`,
            top: `${topOffset}%`,
            left: `${leftOffset}%`,
            transform: "translate(-50%, -50%)",
            whiteSpace: "nowrap",
            opacity: 0.1,
            willChange: "transform, opacity" // Hint for GPU optimization
          }}
        >
          <div className="text-xl sm:text-2xl md:text-3xl font-bold animate-pulse-alt">
            <div>System Disabled</div>
            <div>License Expired</div>
          </div>
        </div>
      ))}

      {/* Foreground Message */}
      <div className="absolute inset-0 flex flex-col justify-center items-center text-center z-10 font-bold">
        <span className="text-white text-5xl sm:text-6xl md:text-7xl glitch">
          System Disabled
        </span>
        <span className="text-red-500 text-3xl sm:text-4xl md:text-5xl mt-4 glow">
          License Expired
        </span>
      </div>
    </div>
  );
};

export default BGLicenseExpired;
