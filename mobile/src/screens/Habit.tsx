import { useRoute } from "@react-navigation/native";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { ScrollView, Text, View } from "react-native";

import { BackButton } from "../components/BackButton";
import { Checkbox } from "../components/Checkbox";
import { ProgressBar } from "../components/ProgressBar";
import { api } from "../lib/axios";
import { generateProgressPercentage } from "../utils/generate-progress-percentage";

interface Params {
  date: string;
}

interface HabitInfo {
  id: string;
  title: string;
  created_at: string;
  completed: boolean;
}

export function Habit() {
  const { params } = useRoute();
  const { date } = params as Params;
  const [habits, setHabits] = useState<HabitInfo[]>([]);

  const parsedDate = dayjs(date);
  const dayOfWeek = parsedDate.format("dddd");
  const dayAndMonth = parsedDate.format("DD/MM");

  const totalHabits = habits.length;
  const completedHabits = habits.filter((habit) => habit.completed).length;
  const amountAccomplishedPercentage =
    totalHabits > 0
      ? generateProgressPercentage(totalHabits, completedHabits)
      : 0;

  useEffect(() => {
    api
      .get("habits/day", {
        params: {
          date: parsedDate.toISOString(),
        },
      })
      .then((response) => {
        setHabits(response.data.habits);
      });
  }, []);

  async function handleToggleHabit(habitId: string) {
    await api.patch(`habits/${habitId}/toggle`, {
      date: parsedDate.toISOString(),
    });

    setHabits((oldHabits) => {
      const newHabits = oldHabits.map((habit) => {
        const newHabit = {
          ...habit,
          completed: habit.id === habitId ? !habit.completed : habit.completed,
        };

        return newHabit;
      });

      return newHabits;
    });
  }

  return (
    <View className="flex-1 bg-background px-8 pt-16">
      <ScrollView showsVerticalScrollIndicator={false}>
        <BackButton />

        <Text className="mt-6 text-zinc-400 font-semibold text-base lowercase">
          {dayOfWeek}
        </Text>
        <Text className="text-white text-3xl font-extrabold">
          {dayAndMonth}
        </Text>

        <ProgressBar progress={amountAccomplishedPercentage} />

        <View className="mt-6">
          {habits.map((habit) => (
            <Checkbox
              key={habit.id}
              title="Dormir bem"
              onChange={() => handleToggleHabit(habit.id)}
              checked={habit.completed}
              value={habit.id}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
