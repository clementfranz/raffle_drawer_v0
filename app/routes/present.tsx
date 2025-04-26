import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" }
  ];
}

export default function Present() {
  return (
    <main className="flex items-center justify-center pt-16 pb-4">
      <h1>Sample Title</h1>
    </main>
  );
}
