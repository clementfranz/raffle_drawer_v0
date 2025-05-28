function getLicenseExpirationDate(): Date {
  const baseExpiration = new Date("2026-05-30T00:00:00+08:00"); // Philippine Time
  const extensionDays = 0;

  const testingMode = false;
  const testDaysFromNow = 8;

  if (testingMode) {
    const now = new Date();
    const testDate = new Date(
      now.getTime() + testDaysFromNow * 24 * 60 * 60 * 1000
    );
    return testDate;
  } else {
    const extendedExpiration = new Date(
      baseExpiration.getTime() + extensionDays * 24 * 60 * 60 * 1000
    );
    return extendedExpiration;
  }
}

function checkDaysBeforeLicenseExpiration(): number {
  const expirationDate = getLicenseExpirationDate();

  // Get current time in UTC then convert to Philippine Time (UTC+8)
  const now = new Date();
  const utc = now.getTime() + now.getTimezoneOffset() * 60000;
  const phTime = new Date(utc + 8 * 60 * 60 * 1000);

  // Normalize both to 00:00:00 in PHT to compare only the date
  expirationDate.setHours(0, 0, 0, 0);
  phTime.setHours(0, 0, 0, 0);

  const millisecondsPerDay = 1000 * 60 * 60 * 24;
  const timeDifference = expirationDate.getTime() - phTime.getTime();
  const daysLeft = Math.ceil(timeDifference / millisecondsPerDay);

  return daysLeft;
}

// Exporting the functions
export { getLicenseExpirationDate, checkDaysBeforeLicenseExpiration };
