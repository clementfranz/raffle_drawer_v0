import { useEffect, useState } from "react";

import type { Route } from "./+types/home";
import { getParticipantById } from "~/api/asClient/participants/getParticipantById";
import { getPaginatedParticipants } from "~/api/asClient/participants/getPaginatedParticipants";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Kopiko Blanca Raffle" },
    { name: "description", content: "Welcome to Kopiko Blanca Raffle!" }
  ];
}

export default function Tester() {
  const [participant, setParticipant] = useState(null);
  const [participantsList, setParticipantsList] = useState([]);

  useEffect(() => {
    // Example: Get single participant with ID 1
    getParticipantById(1).then(setParticipant);

    // Example: Get page 5, size 5000
    getPaginatedParticipants(1, 5000).then((data) =>
      setParticipantsList(data.data)
    );
  }, []);

  return (
    <>
      <div className="title">Tester Only</div>
      <div className="test-contents">Hehehe</div>

      <h2>Single Participant</h2>
      <pre>{JSON.stringify(participant, null, 2)}</pre>

      <h2>Participants List (Page 5, Size 5000)</h2>
      <pre>{JSON.stringify(participantsList, null, 2)}</pre>
    </>
  );
}
