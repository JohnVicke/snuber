import AsyncStorage from "@react-native-async-storage/async-storage";

interface AsyncStore {
  theme: "dark" | "light";
}

export const asyncStore = {
  get(key: keyof AsyncStore) {
    return AsyncStorage.getItem(key) as
      | Promise<AsyncStore[typeof key]>
      | Promise<null>;
  },

  set(key: keyof AsyncStore, value: AsyncStore[typeof key]) {
    return AsyncStorage.setItem(key, value);
  },
  delete(key: keyof AsyncStore) {
    return AsyncStorage.removeItem(key);
  },
};
