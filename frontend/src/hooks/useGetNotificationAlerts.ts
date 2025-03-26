import notificationsApi from "@/services/api/notificationsApi.ts";

function useGetNotificationAlerts() {
  const getNotifications = async (userId: number) => {
    return await notificationsApi.getNotificationAlerts(userId);
  };
  return {
    getNotifications,
  };
}
export default useGetNotificationAlerts;
