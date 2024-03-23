import { Text, View } from "react-native";
import { Redirect, Tabs } from "expo-router";

import { useAuthToken } from "~/hooks/use-auth-token";
import { RealtimeProvider } from "~/modules/authenticated/realtime-provider";

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

  return (
    <RealtimeProvider token={token}>
      <Tabs screenOptions={{ headerShown: false }} />
    </RealtimeProvider>
  );
}
