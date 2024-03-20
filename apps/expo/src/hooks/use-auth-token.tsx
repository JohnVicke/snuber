import React from "react";

import { secureStore } from "~/utils/secure-store";

export function useAuthToken() {
  const [token, setToken] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    async function getToken() {
      const t = await secureStore().get("session_token");
      setToken(t);
      setIsLoading(false);
    }

    void getToken();
  }, []);

  return { isLoading, token };
}
