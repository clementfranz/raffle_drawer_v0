import React from "react";
import useLocalStorageState from "use-local-storage-state";

// Function to get record by ID from IndexedDB
function getRecordByIdEntry(id: number): Promise<any> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("ParticipantsDB"); // Open the DB

    request.onsuccess = (event) => {
      const db = (event.target as IDBRequest).result;
      const transaction = db.transaction(
        ["participantsData_raffle2025"], // Object store name
        "readonly"
      );
      const objectStore = transaction.objectStore(
        "participantsData_raffle2025"
      );

      // Since the `id_entry` is unique, we can directly use the object store's `get` method.
      const getRequest = objectStore.get(id); // Use the `id` to get the record

      getRequest.onsuccess = () => {
        if (getRequest.result) {
          resolve(getRequest.result); // Return the matched record
        } else {
          reject(`No record found with id_entry: ${id}`);
        }
      };

      getRequest.onerror = () => {
        reject("Error retrieving record");
      };
    };

    request.onerror = () => {
      reject("Error opening database");
    };
  });
}

// Function to generate 3 unique random numbers
function generateRandomNumbers(max: number, exempted: number[] = []): number[] {
  const result: number[] = [];
  const allNumbers = new Set<number>();

  // Ensure we generate 3 unique random numbers
  while (result.length < 3) {
    const randomNum = Math.floor(Math.random() * max) + 1; // Generate number between 1 and max

    // Check if the number is not in the exempted list and hasn't been added already
    if (!exempted.includes(randomNum) && !allNumbers.has(randomNum)) {
      result.push(randomNum);
      allNumbers.add(randomNum);
    }
  }

  return result;
}

const StartDrawButton = () => {
  const [winners, setWinners] = useLocalStorageState<any[] | null>("winners", {
    defaultValue: []
  });

  const [fileDetails, setFileDetails] = useLocalStorageState<{
    entries: number;
  }>("fileDetails"); // Default to a large value if not set

  const [startDraw, setStartDraw] = useLocalStorageState("startDraw", {
    defaultValue: false
  });

  // Function to generate winners
  const generateWinners = () => {
    // Ensure there's a valid number of entries to avoid generating invalid random numbers
    const maxEntries = fileDetails?.entries || 100000; // Default to 100000 if fileDetails or entries is undefined

    // Generate 3 random numbers
    const randomNumbers = generateRandomNumbers(maxEntries);

    // Fetch the records based on random numbers
    Promise.all(randomNumbers.map((number) => getRecordByIdEntry(number)))
      .then((winnersData) => {
        // Set winners data after fetching all records
        setWinners(winnersData);
      })
      .catch((error) => {
        console.error("Error fetching winners data:", error);
      });
  };

  // Trigger draw start and winner generation
  const triggerStartDraw = () => {
    generateWinners();
    setStartDraw(true);
  };

  return (
    <>
      <button
        className="bg-gray-600 hover:bg-gray-500 px-4 h-[40px] rounded-2xl cursor-pointer"
        onClick={triggerStartDraw}
      >
        Start Draw
      </button>
    </>
  );
};

export default StartDrawButton;
