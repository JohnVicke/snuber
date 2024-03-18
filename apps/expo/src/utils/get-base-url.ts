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

export function getBaseAPIUrl(port: number) {
  return `http://${getBaseIP()}:${port}`;
}

export function getBaseExpoUrl(port: number) {
  return `exp://${getBaseIP()}:${port}`;
}
