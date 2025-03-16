import { UpdateNotificationMethodRequestDto } from "@/types/notifications.ts";
import notificationsApi from "@/services/api/notificationsApi.ts";

function useUpdateNotificationMethod() {
  const updateNotificationMethod = async (
    request: UpdateNotificationMethodRequestDto,
  ) => {
    return await notificationsApi.updateNotificationMethod(request);
  };
  return {
    updateNotificationMethod,
  };
}
export default useUpdateNotificationMethod;
