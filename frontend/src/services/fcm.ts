import { messaging } from "../lib/firebaseFcmConfig.ts";
import { getToken } from "firebase/messaging";
import { Capacitor } from "@capacitor/core";
import { toast } from "@/hooks/use-toast.ts";

const requestNotificationPermission = async () => {
  if (typeof Capacitor !== "undefined" && Capacitor.getPlatform() === "web") {
    try {
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        console.log("Notification permission granted.");
        await getToken(messaging, {
          vapidKey: import.meta.env.FCM_KEY_PAIR,
        }).then((token) => {
          console.log("FCM token:", token);
        });
      } else {
        console.warn("Web notification permission denied.");
      }
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === "AbortError") {
          toast({
            variant: "default",
            title: "Warning",
            description: "Your browser doesn't support or has Google services for push messaging disabled.",
          })
          console.warn("This browser doesn't support or has Google services for push messaging disabled.");
        }
      }
      else {
        console.error("Error requesting notification permission:", error);
      }
    }
  } else if (typeof Capacitor !== "undefined") {
    // TODO: Implementation for mobile notifications
  }
}

export default requestNotificationPermission;