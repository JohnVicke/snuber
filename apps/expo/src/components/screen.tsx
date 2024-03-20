import React from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export function Screen(props: React.PropsWithChildren) {
  return (
    <SafeAreaView className="flex-1">
      <View className="gap-y-4 px-4">{props.children}</View>
    </SafeAreaView>
  );
}
