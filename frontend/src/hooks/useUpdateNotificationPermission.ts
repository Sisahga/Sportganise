import { UpdateNotificationPermissionRequestDto } from "@/types/notifications.ts";
import notificationsApi from "@/services/api/notificationsApi.ts";

function useUpdateNotificationPermission() {
  const updateNotificationPermission = async (
    request: UpdateNotificationPermissionRequestDto,
  ) => {
    return await notificationsApi.updateNotificationPermission(request);
  };
  return { updateNotificationPermission };
}
export default useUpdateNotificationPermission;
