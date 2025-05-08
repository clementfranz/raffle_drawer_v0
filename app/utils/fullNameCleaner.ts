export function fullNameCleaner(paragraph: string): string {
  // Replace numbers first
  let cleanedName = paragraph.replace(/\d+/g, "");

  // Add spaces after dots, semi-colons, and remove unwanted spaces
  cleanedName = cleanedName
    .replace(/([.])/g, "$1 ") // Add space after dots
    .replace(/([;])/g, "$1 ") // Add space after semi-colons
    .replace(/\s+/g, " ") // Normalize spaces (single space between words)
    .trim(); // Remove leading/trailing spaces

  // Replace enye characters with numbers temporarily (for processing)
  cleanedName = cleanedName
    .replace(/Ñ/g, "6") // Capital Ñ becomes 6
    .replace(/ñ/g, "9"); // Small ñ becomes 9

  // PRE-ENYE: Lowercase all text before returning enyes
  cleanedName = cleanedName.toLowerCase(); // PRE-ENYE

  // Remove specific unwanted strings after lowercasing
  const removalStrings = [
    "Para makumpleto ang iyong registration, ibigay ang mga sumusunod na information. Ano ang inyong Full Name?",
    "Example: Juan B. Dela Cruz",
    "first name",
    "middle name",
    "middle initial",
    "last name"
  ];

  removalStrings.forEach((str) => {
    cleanedName = cleanedName.replace(str.toLowerCase(), ""); // Replace case-insensitive
  });

  // Remove unnecessary symbols, keeping only dot (.) and hyphen (-)
  cleanedName = cleanedName.replace(/[^\w\s.-]/g, ""); // Remove anything that's not a word character, space, dot, or hyphen

  // Remove lone dots surrounded by spaces (e.g. " . "), but preserve valid initials like "J. D."
  cleanedName = cleanedName.replace(/\s\.\s/g, " "); // Remove only lone dots surrounded by spaces

  // Add a dot after lone letters (e.g., "J D" becomes "J. D.")
  cleanedName = cleanedName.replace(/\b([A-Za-z])\b/g, "$1."); // Add dot after lone letters

  // Add a dot after Jr, Sr, III, iii, lll if not already present
  cleanedName = cleanedName.replace(/\b(jr|sr|iii|iii|lll)\b(?!\.)/g, "$1.");

  // Replace double dots with a single dot
  cleanedName = cleanedName.replace(/\.{2,}/g, ".");

  // Split the string into words, then capitalize each word
  cleanedName = cleanedName
    .split(" ")
    .map((word) => {
      // Capitalize the first letter and keep the rest of the word in lowercase
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(" ");

  // POST ENYE: Revert the numbers back to enye characters, then uppercase the whole string
  cleanedName = cleanedName
    .replace(/6/g, "Ñ") // Revert 6 to Ñ (capital)
    .replace(/9/g, "ñ"); // Revert 9 to ñ (small)

  cleanedName = cleanedName.toUpperCase(); // POST ENYE

  // Properly capitalize after reverting back
  cleanedName = cleanedName
    .split(" ")
    .map((word) => {
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(" ");

  return cleanedName;
}
