import React from "react";
import { Pressable, Text, View } from "react-native";

import { ping, signInWithGoogle } from "~/lib/api";
import { trpc } from "~/lib/trpc";

export default function LandingPage() {
  const { mutate, isError, error } = trpc.foo.test.useMutation();
  React.useEffect(() => {
    if (isError) {
      console.error(error);
    }
  }, [isError, error]);

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
          <Text>Ping API</Text>
        </Pressable>
        <Pressable
          onPress={() => {
            void mutate();
          }}
        >
          <Text>TRPC ping</Text>
        </Pressable>
      </View>
    </View>
  );
}
