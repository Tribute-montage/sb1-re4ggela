// US Federal Holidays
export const HOLIDAYS = [
  { month: 0, day: 1, name: "New Year's Day" },
  { month: 0, day: 20, name: "Martin Luther King Jr. Day", rule: "thirdMonday" },
  { month: 1, day: 20, name: "Presidents Day", rule: "thirdMonday" },
  { month: 4, day: 31, name: "Memorial Day", rule: "lastMonday" },
  { month: 5, day: 19, name: "Juneteenth" },
  { month: 6, day: 4, name: "Independence Day" },
  { month: 8, day: 1, name: "Labor Day", rule: "firstMonday" },
  { month: 9, day: 14, name: "Columbus Day", rule: "secondMonday" },
  { month: 10, day: 11, name: "Veterans Day" },
  { month: 10, day: 28, name: "Thanksgiving", rule: "fourthThursday" },
  { month: 11, day: 25, name: "Christmas Day" },
];

export const isHoliday = (date: Date): boolean => {
  const month = date.getMonth();
  const day = date.getDate();
  const dayOfWeek = date.getDay();
  const weekOfMonth = Math.floor((day - 1) / 7) + 1;

  return HOLIDAYS.some(holiday => {
    if (holiday.month === month) {
      if (holiday.rule) {
        switch (holiday.rule) {
          case 'firstMonday':
            return dayOfWeek === 1 && weekOfMonth === 1;
          case 'secondMonday':
            return dayOfWeek === 1 && weekOfMonth === 2;
          case 'thirdMonday':
            return dayOfWeek === 1 && weekOfMonth === 3;
          case 'lastMonday':
            return dayOfWeek === 1 && weekOfMonth === getLastWeekOfMonth(date);
          case 'fourthThursday':
            return dayOfWeek === 4 && weekOfMonth === 4;
          default:
            return false;
        }
      }
      return day === holiday.day;
    }
    return false;
  });
};

const getLastWeekOfMonth = (date: Date): number => {
  const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  return Math.ceil(lastDay / 7);
};