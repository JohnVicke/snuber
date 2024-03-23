import { View } from "react-native";
import { useColorScheme } from "nativewind";

import { Screen } from "~/components/screen";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";

export function ProfileScreen() {
  return (
    <Screen>
      <ModeToggle />
      <Text>Hello, Profile!</Text>
    </Screen>
  );
}

function ModeToggle() {
  const cs = useColorScheme();

  return (
    <View>
      <Button onPress={() => void cs.toggleColorScheme()}>
        <Text>{cs.colorScheme}</Text>
      </Button>
    </View>
  );
}
