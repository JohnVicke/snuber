import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

import "../styles.css";

export default function RootLayout() {
  return (
    <>
      <Stack screenOptions={{ headerShown: false }} />
      <StatusBar />
    </>
  );
}
