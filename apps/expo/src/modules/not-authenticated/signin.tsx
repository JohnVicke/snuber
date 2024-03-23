import { Screen } from "~/components/screen";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Text } from "~/components/ui/text";
import { signInWithGoogle } from "~/lib/api";

export function Signin() {
  return (
    <Screen>
      <Input placeholder="namn@example.se" />
      <Button>
        <Text>Fortsätt med mejl</Text>
      </Button>
      <Text>or</Text>
      <Button onPress={() => signInWithGoogle()}>
        <Text>Logga in med Google</Text>
      </Button>
      <Button>
        <Text>Logga in med Applek</Text>
      </Button>
    </Screen>
  );
}
