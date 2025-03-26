import { messaging } from "../lib/firebaseFcmConfig.ts";
import { getToken } from "firebase/messaging";
import { Capacitor } from "@capacitor/core";
import { useToast } from "@/hooks/use-toast.ts";
import useStoreFcmToken from "@/hooks/useStoreFcmToken.ts";
import { StoreFcmTokenDto } from "@/types/notifications.ts";

export const useRequestNotificationPermission = () => {
  const { toast } = useToast();
  const { storeFcmToken } = useStoreFcmToken();

  const requestPermission = async (userId: number) => {
    if (typeof Capacitor !== "undefined" && Capacitor.getPlatform() === "web") {
      try {
        const permission = await Notification.requestPermission();
        if (permission === "granted") {
          console.log("Notification permission granted.");
          const token = await getToken(messaging, {
            vapidKey: import.meta.env.FCM_KEY_PAIR,
          });
          console.log("Storing token: ", token);
          const fcmTokenDto: StoreFcmTokenDto = {
            accountId: userId,
            token: token,
          };
          const response = await storeFcmToken(fcmTokenDto);
          if (response.status != 200) {
            toast({
              title: "Notification Setup Failure",
              description:
                "We weren't able to setup push notifications for your device. Please try again later",
              variant: "destructive",
            });
            localStorage.setItem("pushNotifications", "disabled");
            return false;
          } else {
            console.log("Notification setup successful.");
            localStorage.setItem("pushNotifications", "enabled");
            return true;
          }
        } else {
          console.warn("Web notification permission denied.");
          return false;
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
        return false;
      }
    } else if (typeof Capacitor !== "undefined") {
      // TODO: Implementation for mobile notifications
      return false;
    }
    return false;
  };

  return { requestPermission };
};
