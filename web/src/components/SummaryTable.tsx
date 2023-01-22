import { generateDaysBefore } from "../utils/generate-dates-from-year-beginning";
import { HabitDay } from "./HabitDay";

const summaryDates = generateDaysBefore();

export function SummaryTable() {
  return (
    <div className="w-full grid grid-rows-7 grid-flow-col auto-cols-[40px] gap-2">
      {summaryDates.map((date) => (
        <HabitDay completed={10} key={date.toISOString()} />
      ))}
    </div>
  );
}
