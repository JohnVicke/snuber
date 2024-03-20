import React from "react";
import { PermissionStatus } from "expo-location";
import { router } from "expo-router";
import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import { useColorScheme } from "nativewind";

import { ChevronLeft } from "~/components/icons";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { colorFromConfig } from "~/utils/from-tailwind-config";
import { SnuberMapProvider } from "./snuber-map/snuber-map-context";
import { useLocation } from "./use-location";

export function Map() {
  const { colorScheme = "dark" } = useColorScheme();
  const { isLoading, status } = useLocation();

  const modalRef = React.useRef<BottomSheetModal>(null);
  const snapPoints = React.useMemo(() => ["25%", "50%"], []);

  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  if (status !== PermissionStatus.GRANTED) {
    return <Text>No location permission</Text>;
  }

  return (
    <SnuberMapProvider>
      <Button
        variant="secondary"
        className="absolute left-4 top-12"
        size="icon"
        onPress={() => {
          if (router.canGoBack()) {
            router.back();
          } else {
            router.push("/(authenticated)");
          }
        }}
      >
        <ChevronLeft
          color={colorFromConfig("primary-foreground", colorScheme)}
        />
        <Button
          variant="secondary"
          className="absolute left-4 top-40"
          size="icon"
        >
          <ChevronLeft
            color={colorFromConfig("primary-foreground", colorScheme)}
          />
        </Button>
      </Button>
      <BottomSheetModal
        containerStyle={{
          backgroundColor: "rgba(0,0,0,0.5)",
        }}
        backgroundStyle={{
          backgroundColor: colorFromConfig("background", colorScheme),
        }}
        handleIndicatorStyle={{
          backgroundColor: colorFromConfig("foreground", colorScheme),
        }}
        ref={modalRef}
        snapPoints={snapPoints}
      >
        <BottomSheetView className="z-10 mx-8 gap-y-4">
          <Text>hello</Text>
          <Button>
            <Text>Skicka anrop!</Text>
          </Button>
        </BottomSheetView>
      </BottomSheetModal>
      <Button
        onPress={() => {
          modalRef.current?.present();
        }}
        className="absolute bottom-4 right-4"
      >
        <Text>Nödanrop</Text>
      </Button>
    </SnuberMapProvider>
  );
}
