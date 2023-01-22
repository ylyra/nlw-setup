import { useRoute } from "@react-navigation/native";
import dayjs from "dayjs";
import { ScrollView, Text, View } from "react-native";

import { BackButton } from "../components/BackButton";
import { Checkbox } from "../components/Checkbox";
import { ProgressBar } from "../components/ProgressBar";

interface Params {
  date: string;
}

export function Habit() {
  const { params } = useRoute();
  const { date } = params as Params;

  const parsedDate = dayjs(date);
  const dayOfWeek = parsedDate.format("dddd");
  const dayAndMonth = parsedDate.format("DD/MM");

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

        <ProgressBar progress={20} />

        <View className="mt-6">
          <Checkbox
            title="2L de água"
            onChange={console.log}
            checked={false}
            value="2"
          />
          <Checkbox
            title="Dormir bem"
            onChange={console.log}
            checked={false}
            value="2"
          />
        </View>
      </ScrollView>
    </View>
  );
}
