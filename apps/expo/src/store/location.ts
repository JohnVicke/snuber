import type { LocationObject } from "expo-location";
import { create } from "zustand";

interface LocationState {
  userLocation: LocationObject | null;
}

interface LocationStoreActions {
  updateUserLocation: (location: LocationObject) => void;
}

interface LocationStore extends LocationState {
  actions: LocationStoreActions;
}

const useLocationStore = create<LocationStore>()((set) => ({
  userLocation: null,
  actions: {
    updateUserLocation: (location) => set({ userLocation: location }),
  },
}));

export const useUserLocation = () =>
  useLocationStore((state) => state.userLocation);

export const useLocationActions = () =>
  useLocationStore((state) => state.actions);
