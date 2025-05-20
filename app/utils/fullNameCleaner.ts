export function fullNameCleaner(paragraph: string): string {
  // Replace numbers first
  let cleanedName = paragraph.replace(/\d+/g, "");

  // Add spaces after dots and semicolons, normalize spaces
  cleanedName = cleanedName
    .replace(/([.;])/g, "$1 ") // Add space after . and ;
    .replace(/\s+/g, " ") // Normalize spaces
    .trim();

  // Replace enye characters temporarily
  cleanedName = cleanedName.replace(/Ñ/g, "6").replace(/ñ/g, "9").toLowerCase();

  // Remove unwanted phrases
  const removalStrings = [
    "Para makumpleto ang iyong registration, ibigay ang mga sumusunod na information. Ano ang inyong Full Name?",
    "Example: Juan B. Dela Cruz",
    "first name",
    "Example",
    "example",
    "N/A",
    "n/a",
    "middle name",
    "middle initial",
    "last name",
    "full name",
    "middle",
    "none",
    "name"
  ];
  for (const str of removalStrings) {
    cleanedName = cleanedName.replace(str.toLowerCase(), "");
  }

  // Keep only word chars, spaces, dots, hyphens
  cleanedName = cleanedName.replace(/[^\w\s.-]/g, "");

  // Remove lone dots surrounded by spaces
  cleanedName = cleanedName.replace(/\s\.\s/g, " ");

  // Add dot after lone letters (initials)
  cleanedName = cleanedName.replace(/\b([a-z])\b/g, "$1.");

  // Move suffixes (Jr, Sr, III, etc.) to end
  let suffix = "";
  cleanedName = cleanedName
    .replace(/\b(jr|sr|iii|lll)\b/gi, (match) => {
      suffix += ` ${match}`;
      return "";
    })
    .trim();

  // Remove extra dots and spaces
  cleanedName = cleanedName.replace(/\.{2,}/g, ".").replace(/\s\.\s/g, " ");

  // Remove dots before or after words (more than 1 letter)
  cleanedName = cleanedName.replace(/(\.\b\w{2,})|(\b\w{2,}\.)/g, (match) =>
    match.replace(/\./g, "")
  );

  // Remove lone dots surrounded by spaces
  cleanedName = cleanedName.replace(/\s\.\s/g, " ");

  // Append suffixes (with dot if missing)
  if (suffix) {
    suffix = suffix
      .split(" ")
      .filter(Boolean)
      .map((sfx) =>
        sfx.replace(/\b(jr|sr|iii|lll)\b/gi, (m) =>
          m.endsWith(".") ? m : m + "."
        )
      )
      .join(" ");
    cleanedName += " " + suffix;
  }

  // Capitalize words
  cleanedName = cleanedName
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");

  // Revert enye characters
  cleanedName = cleanedName.replace(/6/g, "Ñ").replace(/9/g, "ñ");

  return cleanedName.trim();
}
