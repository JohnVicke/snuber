import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SplashScreen, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

import "../styles.css";

import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { ThemeProvider } from "@react-navigation/native";
import { useColorScheme } from "nativewind";

import { NAV_THEME } from "~/lib/constants";
import { TRPCProvider } from "~/lib/trpc";
import { asyncStore } from "~/utils/async-storage";

const DARK = {
  dark: false,
  colors: NAV_THEME.dark,
};

const LIGHT = {
  dark: false,
  colors: NAV_THEME.light,
};

void SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { colorScheme = "dark" } = useColorScheme();
  const [isColorSchemeLoaded, setIsColorSchemeLoaded] = React.useState(false);

  React.useEffect(() => {
    void (async () => {
      const theme = await asyncStore.get("theme");

      if (!theme) {
        await asyncStore.set("theme", colorScheme);
      }

      if (theme !== colorScheme) {
        await asyncStore.set("theme", colorScheme);
      }
    })().finally(() => {
      setIsColorSchemeLoaded(true);
      void SplashScreen.hideAsync();
    });
  }, [colorScheme]);

  if (!isColorSchemeLoaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DARK : LIGHT}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <BottomSheetModalProvider>
          <SafeAreaProvider>
            <TRPCProvider>
              <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
              <Stack screenOptions={{ headerShown: false }} />
            </TRPCProvider>
          </SafeAreaProvider>
        </BottomSheetModalProvider>
      </GestureHandlerRootView>
    </ThemeProvider>
  );
}
