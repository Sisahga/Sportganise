import { Capacitor } from "@capacitor/core";

/**
 * Check if the current platform is mobile.
 */
export function isMobilePlatform() {
  return (
    Capacitor.getPlatform() === "ios" || Capacitor.getPlatform() === "android"
  );
}
