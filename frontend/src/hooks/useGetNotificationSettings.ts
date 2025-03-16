import notificationsApi from "@/services/api/notificationsApi.ts";

function useGetNotificationSettings() {
  const getNotificationSettings = async (userId: number) => {
    return await notificationsApi.getNotificationSettings(userId);
  };
  return {
    getNotificationSettings,
  };
}
export default useGetNotificationSettings;
