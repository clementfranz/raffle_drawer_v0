import React from "react";
import useLocalStorageState from "use-local-storage-state";

type UpperDiv_Props = {
  boxUnit: number;
};

const UpperDiv = ({ boxUnit }: UpperDiv_Props) => {
  const [revealWinner] = useLocalStorageState("revealWinner");
  const [enableSlotMachineAnimation] = useLocalStorageState(
    "enableSlotMachineAnimation"
  );
  const [showWinnerNth] = useLocalStorageState<number>("showWinnerNth", {
    defaultValue: 0
  });
  const text = "Congratulations!";

  return (
    <div
      className={`absolute z-[40] font-[Montserrat] font-bold uppercase top-0 congratulatory-text ${
        enableSlotMachineAnimation && "transition-all"
      } duration-500  ${!revealWinner ? "-translate-y-full" : "delay-500"}`}
      style={{
        top: `${revealWinner ? boxUnit * 0.3 : 0}px`,
        fontSize: `${boxUnit * 1.2}px`,
        display: "flex",
        gap: "0.1em"
      }}
    >
      {showWinnerNth === 0 ? (
        text.split("").map((char, index) => (
          <span
            key={index}
            className={`${enableSlotMachineAnimation && "letter"}`}
            style={{
              animationDelay: `${index * 0.1}s, 0s` // Delay for jump, no delay for gradientShift
            }}
          >
            {char}
          </span>
        ))
      ) : showWinnerNth === 1 ? (
        <span style={{ fontSize: `${boxUnit * 1}px` }}>
          First Backup Winner
        </span>
      ) : showWinnerNth === 2 ? (
        <span style={{ fontSize: `${boxUnit * 1}px` }}>
          Second Backup Winner
        </span>
      ) : (
        <span style={{ fontSize: `${boxUnit * 1}px` }}>
          Third Backup Winner
        </span>
      )}
    </div>
  );
};

export default UpperDiv;
