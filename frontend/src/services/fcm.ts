import { messaging } from "../lib/firebaseFcmConfig.ts";
import { getToken } from "firebase/messaging";
import { Capacitor } from "@capacitor/core";
import { useToast } from "@/hooks/use-toast.ts";
import useStoreFcmToken from "@/hooks/useStoreFcmToken.ts";
import { StoreFcmTokenDto } from "@/types/notifications.ts";

const requestNotificationPermission = async (userId: number) => {
  const { toast } = useToast();
  const { storeFcmToken } = useStoreFcmToken();

  if (typeof Capacitor !== "undefined" && Capacitor.getPlatform() === "web") {
    try {
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        console.log("Notification permission granted.");
        await getToken(messaging, {
          vapidKey: import.meta.env.FCM_KEY_PAIR,
        }).then((token) => {
          console.log("Storing token: ", token);
          const fcmTokenDto: StoreFcmTokenDto = {
            accountId: userId,
            token: token,
          };
          storeFcmToken(fcmTokenDto).then((response) => {
            if (response.status != 200) {
              toast({
                title: "Notification Setup Failure",
                description:
                  "We weren't able to setup push notifications for your device. Please try again later",
                variant: "destructive",
              });
              localStorage.setItem("pushNotifications", "disabled");
            } else {
              console.log("Notification setup successful.");
              localStorage.setItem("pushNotifications", "enabled");
            }
          });
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
            description:
              "Your browser doesn't support or has Google services for push messaging disabled.",
          });
          console.warn(
            "This browser doesn't support or has Google services for push messaging disabled.",
          );
        }
      } else {
        console.error("Error requesting notification permission:", error);
      }
    }
  } else if (typeof Capacitor !== "undefined") {
    // TODO: Implementation for mobile notifications
  }
};

export default requestNotificationPermission;
