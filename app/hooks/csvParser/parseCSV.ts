import Papa from "papaparse";

export const parseCSV = (file: File): Promise<any> => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      complete: (result) => {
        resolve(result.data); // Parsed data will be here
      },
      error: (error) => {
        reject(error); // Handle error if parsing fails
      },
      header: true, // Treat the first row as headers
      skipEmptyLines: true // Skip blank lines
    });
  });
};
