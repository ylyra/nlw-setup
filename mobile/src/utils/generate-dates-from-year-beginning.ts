import dayjs from "dayjs";

export function generateDaysBefore() {
  const today = dayjs();
  const weekDay = today.day();
  const totalDaysToGenerate = 133 - (weekDay + 6 - weekDay * 2);

  return Array.from({ length: totalDaysToGenerate }, (_, i) =>
    today.subtract(i, "day").toDate()
  );
}
