import { router } from "expo-router";

import { Screen } from "~/components/screen";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { trpc } from "~/lib/trpc";
import { secureStore } from "~/utils/secure-store";

export default function AuthenticatedLandingPage() {
  const { mutate } = trpc.auth.signout.useMutation({
    onSettled() {
      void secureStore().delete("session_token");
      router.push("/(non-authenticated)");
    },
  });
  return (
    <Screen>
      <Button onPress={() => router.push("/(authenticated)/map")}>
        <Text>Go to map</Text>
      </Button>
      <Button onPress={() => void mutate()}>
        <Text>sign out</Text>
      </Button>
    </Screen>
  );
}
