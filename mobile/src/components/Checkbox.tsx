import { Feather } from "@expo/vector-icons";
import clsx from "clsx";
import { Text, TouchableOpacity, View } from "react-native";
import Animated, { ZoomIn, ZoomOut } from "react-native-reanimated";
import colors from "tailwindcss/colors";

interface Props {
  title: string;

  value: string | number;
  onChange: (value: string | number) => void;
  checked?: boolean;
}

export function Checkbox({ title, checked, onChange, value }: Props) {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      className="flex-row mb-2 items-center"
      onPress={() => onChange(value)}
    >
      <View
        className={clsx(
          "h-8 w-8 rounded-lg items-center justify-center border-2",
          {
            "bg-green-500 border-green-500": checked,
            "bg-zinc-900 border-zinc-800": !checked,
          }
        )}
      >
        {checked ? (
          <Animated.View
            className="h-8 w-8 bg-green-500 rounded-lg items-center justify-center"
            entering={ZoomIn}
            exiting={ZoomOut}
          >
            <Feather name="check" size={20} color={colors.white} />
          </Animated.View>
        ) : (
          <View className="h-8 w-8 bg-zinc-900 rounded-lg" />
        )}
      </View>

      <Text className="text-white text-base ml-3">{title}</Text>
    </TouchableOpacity>
  );
}
