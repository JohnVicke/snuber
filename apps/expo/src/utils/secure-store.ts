import * as SecureStore from "expo-secure-store";

interface SnuberSecureStore {
  session_token: string;
}

export function secureStore() {
  return {
    get(key: keyof SnuberSecureStore) {
      return SecureStore.getItemAsync(key) as
        | Promise<SnuberSecureStore[typeof key]>
        | Promise<null>;
    },

    set(key: keyof SnuberSecureStore, value: SnuberSecureStore[typeof key]) {
      return SecureStore.setItemAsync(key, value);
    },
    delete(key: keyof SnuberSecureStore) {
      return SecureStore.deleteItemAsync(key);
    },
  };
}
