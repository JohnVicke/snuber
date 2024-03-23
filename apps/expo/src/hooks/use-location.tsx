import React from "react";
import * as Location from "expo-location";

import { useLocationActions } from "~/store/location";

export function useLocation() {
  const [status, setStatus] = React.useState<Location.PermissionStatus>();
  const [isLoading, setIsLoading] = React.useState(true);

  const { updateUserLocation } = useLocationActions();

  React.useEffect(() => {
    async function getLocation() {
      const { status } = await Location.requestForegroundPermissionsAsync();

      setStatus(status);

      if (status !== Location.PermissionStatus.GRANTED) {
        console.error("Permission to access location was denied");
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      updateUserLocation(location);
    }

    void getLocation().finally(() => {
      setIsLoading(false);
    });
  }, [updateUserLocation]);

  return { isLoading, status };
}
