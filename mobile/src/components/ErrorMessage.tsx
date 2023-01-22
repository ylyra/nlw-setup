import { Feather } from "@expo/vector-icons";
import { PropsWithChildren } from "react";
import { Text, View } from "react-native";

import colors from "tailwindcss/colors";

export function ErrorMessage(props: PropsWithChildren) {
  return (
    <View className="flex-row items-center mt-1 font-medium">
      <Feather name="alert-octagon" size={20} color={colors.red[500]} />
      <Text className="text-sm font-normal  max-w-full flex-initial text-red-500 ml-3">
        {props.children}
      </Text>
    </View>
  );
}
