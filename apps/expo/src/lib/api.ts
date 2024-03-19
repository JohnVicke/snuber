import * as Linking from "expo-linking";
import * as Browser from "expo-web-browser";

import { getBaseAPIUrl, getBaseExpoUrl } from "~/utils/get-base-url";
import { Logger } from "~/utils/logger";
import { secureStore } from "~/utils/secure-store";

const API_BASE_URL = `${getBaseAPIUrl()}/api/v1`;

export async function signInWithGoogle() {
  const result = await Browser.openAuthSessionAsync(
    `${API_BASE_URL}/auth/google`,
    `${getBaseExpoUrl(8081)}`,
  );

  if (result.type !== "success") return;

  const url = Linking.parse(result.url);
  const sessionToken = url.queryParams?.session_token?.toString() ?? null;

  if (!sessionToken) return;

  Logger.info("Login succeded");
  await secureStore().set("session_token", sessionToken);
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
