import { useFocusEffect, useNavigation } from "@react-navigation/native";
import dayjs from "dayjs";
import { useCallback, useState } from "react";
import { ScrollView, Text, View } from "react-native";

import { DAY_SIZE, HabitDay } from "../components/HabitDay";
import { Header } from "../components/Header";
import { api } from "../lib/axios";
import { generateDaysBefore } from "../utils/generate-dates-from-year-beginning";

const weekDays = ["D", "S", "T", "Q", "Q", "S", "S"];
const summaryDates = generateDaysBefore();

type Summary = {
  id: string;
  date: string;
  amount: number;
  completed: number;
}[];

export function Home() {
  const { navigate } = useNavigation();
  const [summary, setSummary] = useState<Summary>([]);

  useFocusEffect(
    useCallback(() => {
      api.get("summary").then((response) => {
        setSummary(response.data);
      });
    }, [])
  );

  return (
    <View className="flex-1 bg-background px-8 pt-16">
      <Header />

      <View className="flex-row mt-6 mb-2">
        {weekDays.map((weekDay, index) => (
          <Text
            key={`${weekDay}-${index}`}
            className="text-white text-xl text-center mx-1"
            style={{
              width: DAY_SIZE,
            }}
          >
            {weekDay}
          </Text>
        ))}
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 48,
        }}
      >
        <View className="flex-row flex-wrap">
          {summary.length > 0 &&
            summaryDates.map((date) => {
              const dayInSummary = summary.find((day) => {
                return dayjs(date).isSame(day.date, "day");
              });

              return (
                <HabitDay
                  key={date.toISOString()}
                  date={date}
                  onPress={() =>
                    navigate("habit", {
                      date: date.toISOString(),
                    })
                  }
                  amountCompleted={
                    dayInSummary?.completed ? dayInSummary.completed : 0
                  }
                  amountOfHabits={
                    dayInSummary?.amount ? dayInSummary.amount : 0
                  }
                />
              );
            })}
        </View>
      </ScrollView>
    </View>
  );
}
