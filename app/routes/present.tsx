import type { Route } from "./+types/home";

import SlotMachineItem from "~/components/SlotMachineItem";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Kopiko Blanca Raffle" },
    { name: "description", content: "Welcome to React Router!" }
  ];
}

export default function Present() {
  const ANCode = "JOHN0CNRDO";

  return (
    <main className="flex items-center justify-center pt-16 pb-4 flex-col gap-4">
      <h1>Sample Title</h1>
      <div className="slot-machine-shell">
        <div className="slot-machine select-none">
          <div className="slot-machine-inner flex">
            <SlotMachineItem targetChar={ANCode[0]} delayReveal={1} />
            <SlotMachineItem targetChar={ANCode[1]} delayReveal={2} />
            <SlotMachineItem targetChar={ANCode[2]} delayReveal={3} />
            <SlotMachineItem targetChar={ANCode[3]} delayReveal={4} />
            <SlotMachineItem targetChar={ANCode[4]} delayReveal={5} />
            <SlotMachineItem targetChar={ANCode[5]} delayReveal={6} />
            <SlotMachineItem targetChar={ANCode[6]} delayReveal={7} />
            <SlotMachineItem targetChar={ANCode[7]} delayReveal={8} />
            <SlotMachineItem targetChar={ANCode[8]} delayReveal={9} />
            <SlotMachineItem targetChar={ANCode[9]} delayReveal={10} />
          </div>
        </div>
      </div>
    </main>
  );
}
