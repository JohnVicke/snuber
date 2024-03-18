import * as Linking from "expo-linking";
import * as SecureStore from "expo-secure-store";
import * as Browser from "expo-web-browser";

import { getBaseAPIUrl, getBaseExpoUrl } from "~/utils/get-base-url";

const API_BASE_URL = `${getBaseAPIUrl(8787)}/api/v1`;

export async function signInWithGoogle() {
  const result = await Browser.openAuthSessionAsync(
    `${API_BASE_URL}/auth/google`,
    `${getBaseExpoUrl(8081)}/${8081}/login`,
  );

  if (result.type !== "success") return;

  const url = Linking.parse(result.url);
  const sessionToken = url.queryParams?.session_token?.toString() ?? null;

  if (!sessionToken) return;

  await SecureStore.setItemAsync("session_token", sessionToken);
}

export async function ping() {
  try {
    const res = await fetch(`${API_BASE_URL}/routes`, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.log(await res.json());
  } catch (e) {
    console.error(e);
  }
}
