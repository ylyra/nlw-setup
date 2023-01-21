interface HabitProps {
  completed: number;
}

export function Habit({ completed }: HabitProps) {
  return <div className="bg-zinc-800 w-10 h-10" />;
}
