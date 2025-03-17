import notificationsApi from "@/services/api/notificationsApi.ts";

function useMarkNotificationsRead() {
  const markNotificationsRead = async (userId: number) => {
    return await notificationsApi.markNotificationsRead(userId);
  };
  return {
    markNotificationsRead,
  };
}
export default useMarkNotificationsRead;
