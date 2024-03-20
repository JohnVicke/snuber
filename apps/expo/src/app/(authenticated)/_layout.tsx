import { Text, View } from "react-native";
import { Redirect, Stack } from "expo-router";

import { useAuthToken } from "~/hooks/use-auth-token";

/**
 * Naive authentication check, the tRPC errorLink will redirect
 * to the sign-in page if the API returns an UNAUTHORIZED error.
 */
export default function AuthenticatedLayout() {
  const { token, isLoading } = useAuthToken();

  if (isLoading) {
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (!token) {
    return <Redirect href="/(non-authenticated)/signin" />;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
