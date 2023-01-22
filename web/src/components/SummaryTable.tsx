import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { api } from "../lib/axios";
import { generateDaysBefore } from "../utils/generate-dates-from-year-beginning";
import { HabitDay } from "./HabitDay";

const summaryDates = generateDaysBefore();

type Summary = {
  id: string;
  date: string;
  amount: number;
  completed: number;
}[];

export function SummaryTable() {
  const [summary, setSummary] = useState<Summary>([]);

  useEffect(() => {
    api.get("summary").then((response) => {
      setSummary(response.data);
    });
  }, []);

  return (
    <div className="w-full grid grid-rows-7 grid-flow-col auto-cols-[40px] gap-2">
      {summary.length > 0 &&
        summaryDates.map((date) => {
          const dayInSummary = summary.find((day) => {
            return dayjs(date).isSame(day.date, "day");
          });

          return (
            <HabitDay
              key={date.toISOString()}
              date={date}
              amount={dayInSummary?.amount}
              defaultCompleted={dayInSummary?.completed}
            />
          );
        })}
    </div>
  );
}
