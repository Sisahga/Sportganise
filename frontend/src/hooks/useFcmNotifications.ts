import { useEffect } from "react";
import { messaging } from "@/lib/firebaseFcmWebConfig.ts";
import { onMessage } from "firebase/messaging";
import Logo from "@/assets/Logo.png";
import { isMobilePlatform } from "@/utils/isMobilePlatform.ts";

// Only call this if it's web.
const useFcmNotifications = () => {
  useEffect(() => {
    if (!isMobilePlatform() && messaging) {
      const unsubscribe = onMessage(messaging, (payload) => {
        console.log("Foreground notification received:", payload);

        if (Notification.permission === "granted") {
          console.log("Showing notification...");
          console.log(payload.notification);
          new Notification(payload.notification?.title || "New Notification", {
            body: payload.notification?.body,
            icon: Logo,
          });
        }
      });

      return () => unsubscribe();
    }
  }, []);
};
export default useFcmNotifications;
