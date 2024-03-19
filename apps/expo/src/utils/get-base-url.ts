import Constants from "expo-constants";

function getBaseIP() {
  const debuggerHost = Constants.expoConfig?.hostUri;
  const localhost = debuggerHost?.split(":")[0];

  if (!localhost) {
    throw new Error(
      "Failed to get localhost. Please point to your production server.",
    );
  }
  return localhost;
}

export function getBaseAPIUrl() {
  return "https://bright-kingfish-monthly.ngrok-free.app";
}

export function getBaseExpoUrl(port: number) {
  return `exp://${getBaseIP()}:${port}`;
}
