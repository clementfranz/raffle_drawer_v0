import type { Route } from "./+types/home";

import SlotMachineItem from "~/components/SlotMachineItem";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" }
  ];
}

export default function Present() {
  return (
    <main className="flex items-center justify-center pt-16 pb-4 flex-col gap-4">
      <h1>Sample Title</h1>
      <div className="slot-machine-shell">
        <div className="slot-machine select-none">
          <div className="slot-machine-inner flex">
            <SlotMachineItem targetChar={"K"} delayReveal={1} />
            <SlotMachineItem targetChar={"O"} delayReveal={2} />
            <SlotMachineItem targetChar={"P"} delayReveal={3} />
            <SlotMachineItem targetChar={"I"} delayReveal={4} />
            <SlotMachineItem targetChar={"K"} delayReveal={5} />
            <SlotMachineItem targetChar={"O"} delayReveal={6} />
            <SlotMachineItem targetChar={"B"} delayReveal={7} />
            <SlotMachineItem targetChar={"L"} delayReveal={8} />
            <SlotMachineItem targetChar={"N"} delayReveal={9} />
            <SlotMachineItem targetChar={"C"} delayReveal={10} />
          </div>
        </div>
      </div>
    </main>
  );
}
