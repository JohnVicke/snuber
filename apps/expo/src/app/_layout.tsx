import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

import "../styles.css";

import { SafeAreaProvider } from "react-native-safe-area-context";

import { TRPCProvider } from "~/lib/trpc";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <TRPCProvider>
        <Stack screenOptions={{ headerShown: false }} />
        <StatusBar />
      </TRPCProvider>
    </SafeAreaProvider>
  );
}
