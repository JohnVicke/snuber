import React from "react";
import { View } from "react-native";
import MapView from "react-native-maps";
import { StyleSheet } from "nativewind";

import { useUserLocation } from "~/store/location";

const DEFAULT_ZOOM = 0.005;

export const SnuberMapProvider = React.forwardRef<
  MapView,
  React.PropsWithChildren
>((props, ref) => {
  const userLocation = useUserLocation();
  return (
    <View className="flex-1">
      <MapView
        ref={ref}
        initialRegion={{
          latitude: userLocation?.coords.latitude ?? 59.3293,
          longitude: userLocation?.coords.longitude ?? 18.0686,
          latitudeDelta: DEFAULT_ZOOM,
          longitudeDelta: DEFAULT_ZOOM,
        }}
        style={StyleSheet.absoluteFill}
      />
      {props.children}
    </View>
  );
});

SnuberMapProvider.displayName = "SnuberMapProvider";
