import { PushNotifications } from "@capacitor/push-notifications";

export const registerPushNotifications = async () => {
  const permission = await PushNotifications.requestPermissions();
  if (permission.receive === "granted") {
    await PushNotifications.register();
  } else {
    console.warn("Push notification permission denied");
  }

  await PushNotifications.addListener("registration", (token) => {
    console.log("Push token:", token.value);
  });

  await PushNotifications.addListener("registrationError", (error) => {
    console.error("Push registration error:", error);
  });

  await PushNotifications.addListener(
    "pushNotificationReceived",
    (notification) => {
      console.log("Push notification received:", notification);
    },
  );

  await PushNotifications.addListener(
    "pushNotificationActionPerformed",
    (notification) => {
      console.log("Push action performed:", notification);
    },
  );
};
