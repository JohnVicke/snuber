import React from "react";
import { Text, View } from "react-native";
import { Redirect, Stack } from "expo-router";

import { useAuthToken } from "~/hooks/use-auth-token";

export default function NonAuthenticatedLayout() {
  const { token, isLoading } = useAuthToken();

  if (isLoading) {
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (!token) {
    return <Redirect href="/(authenticated)" />;
  }

  return <Stack />;
}
