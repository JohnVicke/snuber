import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";

export function Screen(props: React.PropsWithChildren) {
  return <SafeAreaView className="flex-1">{props.children}</SafeAreaView>;
}
