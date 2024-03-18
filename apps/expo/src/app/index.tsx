import { Pressable, Text, View } from "react-native";

import { ping, signInWithGoogle } from "~/lib/api";

export default function LandingPage() {
  return (
    <View className="flex-1">
      <Text className="text-gray-900">Hello</Text>
      <View className="flex-1 gap-y-8">
        <Pressable
          onPress={() => {
            void signInWithGoogle();
          }}
        >
          <Text>login with google</Text>
        </Pressable>
        <Pressable
          onPress={() => {
            void ping();
          }}
        >
          <Text>Ping</Text>
        </Pressable>
      </View>
    </View>
  );
}
