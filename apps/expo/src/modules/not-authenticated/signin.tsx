import { Screen } from "~/components/screen";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Text } from "~/components/ui/text";
import { signInWithGoogle } from "~/lib/api";

export function Signin() {
  return (
    <Screen>
      <Input placeholder="namn@example.se" />
      <Button>Fortsätt med mejl</Button>
      <Text>or</Text>
      <Button onPress={() => signInWithGoogle()}>Logga in med Google</Button>
      <Button>Logga in med Apple</Button>
    </Screen>
  );
}
