import React from "react";
import { View } from "react-native";

import { SnuberMap } from "~/modules/authenticated/snuber-map";

export default function AuthenticatedLandingPage() {
  return (
    <View className="flex-1">
      <SnuberMap />
    </View>
  );
}
