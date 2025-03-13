import { NotificationRequest } from "@/types/notifications.ts";
import notificationsApi from "@/services/api/notificationsApi.ts";

function useSendNotification() {
  const sendNotification = async (notifRequest: NotificationRequest) => {
    // Do nothing after sending the notification. Error will be logged if notification fails to send in BE.
    // Don't disrupt the flow if notification fails to send.
    return await notificationsApi.sendNotification(notifRequest);
  };
  return {
    sendNotification,
  };
}
export default useSendNotification;
