import React from "react";
import useLocalStorageState from "use-local-storage-state";
import { useWinnerRecords } from "~/hooks/useWinnerRecords";

type LowerDiv_Props = {
  boxUnit: number;
};

const LowerDiv = ({ boxUnit }: LowerDiv_Props) => {
  const [revealWinner] = useLocalStorageState("revealWinner");
  const [enableSlotMachineAnimation] = useLocalStorageState(
    "enableSlotMachineAnimation"
  );
  const [showWinnerNth] = useLocalStorageState<number>("showWinnerNth", {
    defaultValue: 0
  });

  const [winners] = useLocalStorageState<any[]>("winners");
  const { winnerRecords, getWinnerByIndex } = useWinnerRecords();
  const winner = getWinnerByIndex(showWinnerNth as 0 | 3 | 1 | 2);
  return (
    <div
      className={` absolute z-[45] h-1/2 bottom-0 flex justify-center items-center flex-col ${
        enableSlotMachineAnimation && "transition-all"
      } duration-500  ${
        !revealWinner ? "translate-y-full " : "delay-500 duration-[800ms]"
      }`}
    >
      <div
        className={`participant-info ${
          enableSlotMachineAnimation && "flowing-gradient"
        } rounded-3xl overflow-hidden`}
      >
        <div
          className="participant-name font-['Sour_Gummy'] font-bold"
          style={{
            padding: `${boxUnit * 0.2}px ${boxUnit * 0.6}px`,
            fontSize: `${boxUnit * 0.9}px`
          }}
        >
          {winner?.full_name}
        </div>
        <div
          className="participant-location w-full text-center bg-white uppercase font-[Montserrat] font-bold"
          style={{
            padding: `${boxUnit * 0.2}px`,
            fontSize: `${boxUnit * 0.6}px`
          }}
        >
          {winner?.regional_location}
        </div>
      </div>
    </div>
  );
};

export default LowerDiv;
