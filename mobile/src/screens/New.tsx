import { Feather } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import clsx from "clsx";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { z } from "zod";

import colors from "tailwindcss/colors";
import { BackButton } from "../components/BackButton";
import { Checkbox } from "../components/Checkbox";
import { ErrorMessage } from "../components/ErrorMessage";
import { Input } from "../components/Input";
import { api } from "../lib/axios";

const availableWeekDays = [
  "Domingo",
  "Segunda-feira",
  "Terça-feira",
  "Quarta-feira",
  "Quinta-feira",
  "Sexta-feira",
  "Sábado",
];

const formSchema = z.object({
  title: z
    .string()
    .min(3, "O título deve ter no mínimo 3 caracteres")
    .refine(
      (value) => value.trim().length > 2,
      "O título deve ter no mínimo 3 caracteres"
    ),
  weekDays: z.array(
    z
      .number()
      .min(0, "O dia da semana deve ser um número entre 0 e 6")
      .max(6, "O dia da semana deve ser um número entre 0 e 6")
  ),
});

type FormValues = z.infer<typeof formSchema>;

export function New() {
  const { control, handleSubmit, formState, reset } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      weekDays: [],
    },
  });

  const onNewHabitSubmit: SubmitHandler<FormValues> = async ({
    title,
    weekDays,
  }) => {
    await api.post("habits", {
      title,
      weekDays,
    });

    Alert.alert("Criado", "Hábito criado com sucesso!");

    reset();
  };

  return (
    <View className="flex-1 bg-background px-8 pt-16">
      <ScrollView showsVerticalScrollIndicator={false}>
        <BackButton />

        <Text className="mt-6 text-white font-extrabold text-3xl">
          Criar hábito
        </Text>

        <View>
          <Text className="mt-6 text-white font-semibold text-base">
            Qual seu comprometimento?
          </Text>

          <Input
            control={control}
            name="title"
            placeholder="ex.: Exercícios, dormir bem, etc..."
          />

          {formState.errors.title && (
            <ErrorMessage>{formState.errors.title.message}</ErrorMessage>
          )}
        </View>

        <View>
          <Text className="font-semibold mt-4 mb-3 text-white text-base">
            Qual a recorrência?
          </Text>

          <Controller
            control={control}
            name="weekDays"
            render={({ field: { onChange, value } }) => (
              <View>
                {availableWeekDays.map((weekDay, index) => (
                  <Checkbox
                    title={weekDay}
                    key={weekDay}
                    value={index}
                    onChange={() => {
                      if (value.includes(index)) {
                        onChange(
                          value.filter((item: number) => item !== index)
                        );
                      } else {
                        onChange([...value, index]);
                      }
                    }}
                    checked={value ? value.includes(index) : false}
                  />
                ))}
              </View>
            )}
          />

          {formState.errors.weekDays && (
            <ErrorMessage>{formState.errors.weekDays.message}</ErrorMessage>
          )}
        </View>
      </ScrollView>

      <TouchableOpacity
        onPress={handleSubmit(onNewHabitSubmit)}
        activeOpacity={0.7}
        className={clsx(
          "mt-6 rounded-lg p-4 flex-row items-center justify-center font-semibold bg-green-600 transition-colors",
          {
            "cursor-not-allowed opacity-50": formState.isSubmitting,
            "hover:bg-green-500": !formState.isSubmitting,
          }
        )}
      >
        <Feather name="check" size={20} color={colors.white} />
        <Text className="text-white ml-2">Criar hábito</Text>
      </TouchableOpacity>
    </View>
  );
}
