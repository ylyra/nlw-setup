import { Control, useController } from "react-hook-form";
import { TextInput, TextInputProps } from "react-native";
import colors from "tailwindcss/colors";

interface Props<TControl extends Control<any>>
  extends Omit<
    TextInputProps,
    "onChangeText" | "value" | "placeholderTextColor"
  > {
  name: TControl extends Control<infer T> ? keyof T : never;
  control: TControl;
}

export function Input<TControl extends Control<any>>({
  control,
  name,
  ...props
}: Props<TControl>) {
  const { field } = useController({
    name,
    control,
  });

  return (
    <TextInput
      className="h-12 pl-4 rounded-lg mt-3 bg-zinc-800 text-white focus:border-2 focus:border-green-600"
      value={field.value}
      onChangeText={field.onChange}
      placeholderTextColor={colors.zinc[400]}
      {...props}
    />
  );
}
