import { NotificationRequest } from "@/types/notifications.ts";
import notificationsApi from "@/services/api/notificationsApi.ts";

function useSendNotification() {
  const sendNotification = (notifRequest: NotificationRequest) => {
    // Do nothing after sending the notification. Error will be logged if notification fails to send in BE.
    // Don't disrupt the flow if notification fails to send.
    notificationsApi.sendNotification(notifRequest).then((r) => r);
  };
  return {
    sendNotification,
  };
}
export default useSendNotification;
