import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

import "../styles.css";

import { TRPCProvider } from "~/lib/trpc";

export default function RootLayout() {
  return (
    <TRPCProvider>
      <Stack screenOptions={{ headerShown: false }} />
      <StatusBar />
    </TRPCProvider>
  );
}
