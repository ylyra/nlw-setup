import * as Checkbox from "@radix-ui/react-checkbox";
import { Check } from "phosphor-react";
import { useEffect, useState } from "react";
import { api } from "../lib/axios";

interface HabitLisProps {
  date: Date;
  onCompletedChanged: (completed: number, amount: number) => void;
}

interface HabitInfo {
  id: string;
  title: string;
  created_at: string;
  completed: boolean;
}

export function HabitsList({ date, onCompletedChanged }: HabitLisProps) {
  const [habits, setHabits] = useState<HabitInfo[]>([]);

  useEffect(() => {
    api
      .get("habits/day", {
        params: {
          date: date.toISOString(),
        },
      })
      .then((response) => {
        setHabits(response.data.habits);
      });
  }, []);

  async function handleToggleHabit(habitId: string) {
    await api.patch(`/habits/${habitId}/toggle`, {
      date: date.toISOString(),
    });

    let completedHabits: string[] = [];

    setHabits((oldHabits) => {
      const newHabits = oldHabits.map((habit) => {
        const newHabit = {
          ...habit,
          completed: habit.id === habitId ? !habit.completed : habit.completed,
        };

        if (newHabit.completed) {
          completedHabits.push(newHabit.id);
        }

        return newHabit;
      });

      return newHabits;
    });

    onCompletedChanged(completedHabits.length, habits.length);
  }

  return (
    <div className="mt-6 flex flex-col gap-3">
      {habits.map((habit) => (
        <Checkbox.Root
          key={habit.id}
          onCheckedChange={() => handleToggleHabit(habit.id)}
          checked={habit.completed}
          className="flex items-center gap-3 group focus:outline-none disabled:cursor-not-allowed"
        >
          <div className="h-8 w-8 rounded-lg flex items-center justify-center bg-zinc-900 border-2 border-zinc-800 group-data-[state=checked]:bg-green-500 group-data-[state=checked]:border-green-50 transition-colors group-focus:ring-2 group-focus:ring-violet-600 group-focus:ring-offset-2 group-focus:ring-offset-background">
            <Checkbox.Indicator>
              <Check size={20} className="text-white" />
            </Checkbox.Indicator>
          </div>

          <span className="font-semibold text-xl text-white leading-tight group-data-[state=checked]:line-through group-data-[state=checked]:text-zinc-400">
            {habit.title}
          </span>
        </Checkbox.Root>
      ))}
    </div>
  );
}
