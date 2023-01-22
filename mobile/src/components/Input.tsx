import { Control, useController } from "react-hook-form";
import { TextInput } from "react-native";

interface Props<TControl extends Control<any>> {
  name: TControl extends Control<infer T> ? keyof T : never;
  control: TControl;
}

export function Input<TControl extends Control<any>>({
  control,
  name,
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
    />
  );
}
