import Papa from "papaparse";

export async function exportCSVAuto<T extends Record<string, any>>(
  entries: T[],
  filename: string = "data.csv",
  excludeHeaders: string[] = []
): Promise<boolean> {
  if (entries.length === 0) {
    console.warn("No entries to export.");
    return false;
  }

  // Auto-detect headers from the first entry's keys and exclude unwanted headers
  const headers = Object.keys(entries[0]).filter(
    (header) => !excludeHeaders.includes(header)
  );

  // Use PapaParse to convert objects to CSV
  const csv = Papa.unparse({
    fields: headers,
    data: entries.map((entry) => headers.map((header) => entry[header] ?? ""))
  });

  // Trigger download
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();

  // Cleanup
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
  return true;
}
