import clsx from "clsx";
import dayjs from "dayjs";
import { useState } from "react";

interface HabitProps {
  date: Date;
  defaultCompleted?: number;
  amount?: number;
}

export function HabitDay({ amount, defaultCompleted, date }: HabitProps) {
  const [completed, setCompleted] = useState(defaultCompleted || 0);

  const comlpetedPercentage =
    amount && amount > 0 ? Math.round((completed / amount) * 100) : 0;

  const dayAndMonth = dayjs(date).format("DD/MM");
  const dayOfWeek = dayjs(date).format("dddd");
  const today = dayjs().startOf("day").toDate();
  const isCurrentDay = dayjs(date).startOf("day").isSame(today);

  function handleCompletedChaged(completed: number) {
    setCompleted(completed);
  }

  return (
    <div
      className={clsx(
        "w-10 h-10 bg-zinc-900 border-2 border-zinc-800 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-violet-600 focus:ring-offset-2 focus:ring-offset-background",
        {
          "bg-zinc-900 border-zinc-800": comlpetedPercentage === 0,
          "bg-violet-900 border-violet-500":
            comlpetedPercentage > 0 && comlpetedPercentage < 20,
          "bg-violet-800 border-violet-500":
            comlpetedPercentage >= 20 && comlpetedPercentage < 40,
          "bg-violet-700 border-violet-500":
            comlpetedPercentage >= 40 && comlpetedPercentage < 60,
          "bg-violet-600 border-violet-500":
            comlpetedPercentage >= 60 && comlpetedPercentage < 80,
          "bg-violet-500 border-violet-400": comlpetedPercentage >= 80,
          ["border-white border-4"]: isCurrentDay,
        }
      )}
    />
  );
}
