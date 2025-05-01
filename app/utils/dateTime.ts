type WeekRange = {
  startingDate: Date;
  endingDate: Date;
  weekName: string;
  weekCode: string;
};

const getWeekCode = (monday: Date, sunday: Date) => {
  const format = (d: Date) => {
    const yy = d.getFullYear().toString().slice(-2);
    const mm = (d.getMonth() + 1).toString().padStart(2, "0");
    const dd = d.getDate().toString().padStart(2, "0");
    return `${yy}${mm}${dd}`;
  };
  return `${format(monday)}_${format(sunday)}`;
};

const getWeekName = (monday: Date, sunday: Date) => {
  const options: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "numeric"
  };

  const startStr = monday.toLocaleDateString("en-US", options);
  const endMonth = sunday.getMonth() === monday.getMonth();

  const endOptions: Intl.DateTimeFormatOptions = endMonth
    ? { day: "numeric" }
    : { month: "short", day: "numeric" };

  const endStr = sunday.toLocaleDateString("en-US", endOptions);

  // Use ending year for display
  const yearStr = sunday.getFullYear();

  return `${startStr} to ${endStr}, ${yearStr}`;
};

export function getWeek(date?: Date): WeekRange {
  const targetDate = date ? new Date(date) : new Date();

  const day = targetDate.getDay();
  const diffToMonday = day === 0 ? -6 : 1 - day;

  const monday = new Date(targetDate);
  monday.setDate(targetDate.getDate() + diffToMonday);
  monday.setHours(0, 0, 0, 0);

  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  sunday.setHours(23, 59, 59, 999);

  const weekName = getWeekName(monday, sunday);

  const weekCode = getWeekCode(monday, sunday);

  return {
    startingDate: monday,
    endingDate: sunday,
    weekName,
    weekCode
  };
}

export const extractWeekCode = (weekCode: string) => {
  const [startCode, endCode] = weekCode.split("_"); // Split into two parts
  const [startYear, startMonth, startDay] = [
    startCode.slice(0, 2),
    startCode.slice(2, 4),
    startCode.slice(4)
  ];
  const [endYear, endMonth, endDay] = [
    endCode.slice(0, 2),
    endCode.slice(2, 4),
    endCode.slice(4)
  ];

  const currentYear = new Date().getFullYear().toString().slice(0, 2); // Get the last two digits of the current year

  // Convert to full year format
  const startFullYear = `20${startYear}`;
  const endFullYear = `20${endYear}`;

  // Create Date objects
  const startingDate = new Date(`${startFullYear}-${startMonth}-${startDay}`);
  const endingDate = new Date(`${endFullYear}-${endMonth}-${endDay}`);

  // Return object with starting and ending dates
  return {
    startingDate,
    endingDate
  };
};
