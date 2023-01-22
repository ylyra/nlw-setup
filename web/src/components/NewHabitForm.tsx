import { zodResolver } from "@hookform/resolvers/zod";
import * as Checkbox from "@radix-ui/react-checkbox";
import clsx from "clsx";
import { Check } from "phosphor-react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";

import { api } from "../lib/axios";
import { ErrorMessage } from "./ErrorMessage";

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
  title: z.string().min(3, "O título deve ter no mínimo 3 caracteres"),
  weekDays: z.array(
    z
      .number()
      .min(0, "O dia da semana deve ser um número entre 0 e 6")
      .max(6, "O dia da semana deve ser um número entre 0 e 6")
  ),
});

type FormValues = z.infer<typeof formSchema>;

export function NewHabitForm() {
  const { control, formState, handleSubmit, register } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      weekDays: [],
    },
  });

  const createNewHabit: SubmitHandler<FormValues> = async ({
    title,
    weekDays,
  }) => {
    await api.post("habits", {
      title,
      weekDays,
    });

    alert("Hábito criado com sucesso!");
  };

  return (
    <form
      onSubmit={handleSubmit(createNewHabit)}
      className="w-full flex flex-col mt-6"
    >
      <div>
        <label htmlFor="title" className="font-semibold leading-tight">
          Qual seu comprometimento?
        </label>

        <input
          type="text"
          id="title"
          placeholder="ex.: Exercícios, dormir bem, etc..."
          className="p-4 rounded-lg mt-3 bg-zinc-800 text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-violet-600 focus:ring-offset-2 focus:ring-offset-zinc-900"
          autoFocus
          {...register("title")}
        />

        {formState.errors.title && (
          <ErrorMessage>{formState.errors.title.message}</ErrorMessage>
        )}
      </div>

      <div className="mt-4">
        <label htmlFor="" className="font-semibold leading-tight">
          Qual a recorrência?
        </label>

        <Controller
          control={control}
          name="weekDays"
          render={({ field: { onChange, value } }) => (
            <div className="flex flex-col gap-2 mt-3">
              {availableWeekDays.map((weekDay, index) => (
                <Checkbox.Root
                  key={weekDay}
                  className="flex items-center gap-3 group focus:outline-none"
                  checked={value.includes(index)}
                  onCheckedChange={() => {
                    const newWeekDays = value.includes(index)
                      ? value.filter((day) => day !== index)
                      : [...value, index];

                    onChange(newWeekDays);
                  }}
                >
                  <div className="h-8 w-8 rounded-lg flex items-center justify-center bg-zinc-900 border-2 border-zinc-800 group-data-[state=checked]:bg-green-500 group-data-[state=checked]:border-green-50 transition-colors group-focus:ring-2 group-focus:ring-violet-600 group-focus:ring-offset-2 group-focus:ring-offset-background">
                    <Checkbox.Indicator>
                      <Check size={20} className="text-white" />
                    </Checkbox.Indicator>
                  </div>

                  <span className="text-white leading-tight">{weekDay}</span>
                </Checkbox.Root>
              ))}
            </div>
          )}
        />
        {formState.errors.weekDays && (
          <ErrorMessage>{formState.errors.weekDays.message}</ErrorMessage>
        )}
      </div>

      <button
        className={clsx(
          "mt-6 rounded-lg p-4 flex items-center justify-center gap-3 font-semibold bg-green-600 transition-colors focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2 focus:ring-offset-zinc-900",
          {
            "cursor-not-allowed opacity-50": formState.isSubmitting,
            "hover:bg-green-500": !formState.isSubmitting,
          }
        )}
        disabled={formState.isSubmitting}
      >
        <Check size={20} weight="bold" />
        Confirmar
      </button>
    </form>
  );
}
