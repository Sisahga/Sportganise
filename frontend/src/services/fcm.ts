import { messaging } from "../lib/firebaseFcmConfig.ts";
import { getToken } from "firebase/messaging";
import { Capacitor } from "@capacitor/core";

const requestNotificationPermission = async () => {
  if (typeof Capacitor !== "undefined" && Capacitor.getPlatform() === "web") {
    try {
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        console.log("Notification permission granted.");
        const token = await getToken(messaging, {
          vapidKey: import.meta.env.FCM_KEY_PAIR,
        });
        console.log("Notification token:", token);
        return token;
      } else {
        console.warn("Web notification permission denied.");
      }
    } catch (error) {
      console.error("Error requesting notification permission:", error);
    }
  } else if (typeof Capacitor !== "undefined") {
    // TODO: Implementation for mobile notifications
  }
}

export default requestNotificationPermission;