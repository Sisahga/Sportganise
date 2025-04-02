import { ApiService } from "@/services/apiHelper";
import {
  StoreFcmTokenDto,
  NotificationRequest,
  NotificationSettings,
  UpdateNotificationMethodRequestDto,
  UpdateNotificationPermissionRequestDto,
  NotificationAlerts,
} from "@/types/notifications.ts";
import ResponseDto from "@/types/response.ts";

const EXTENDED_BASE_URL = "/api/notifications";

const notificationsApi = {
  getNotificationAlerts: async (userId: number) => {
    return await ApiService.get<ResponseDto<NotificationAlerts>>(
      `${EXTENDED_BASE_URL}/get-notif-alerts/${userId}`,
    );
  },
  markNotificationsRead: async (userId: number) => {
    return await ApiService.put<ResponseDto<null>>(
      `${EXTENDED_BASE_URL}/mark-alerts-read/${userId}`,
      {},
    );
  },
  getNotificationSettings: async (userId: number) => {
    return await ApiService.get<ResponseDto<NotificationSettings>>(
      `${EXTENDED_BASE_URL}/get-notif-settings/${userId}`,
    );
  },
  updateNotificationMethod: async (
    request: UpdateNotificationMethodRequestDto,
  ) => {
    return await ApiService.put<ResponseDto<null>>(
      `${EXTENDED_BASE_URL}/update-notification-method`,
      request,
    );
  },
  updateNotificationPermission: async (
    request: UpdateNotificationPermissionRequestDto,
  ) => {
    return await ApiService.put<ResponseDto<null>>(
      `${EXTENDED_BASE_URL}/update-notification-permission`,
      request,
    );
  },
  sendNotification: async (request: NotificationRequest) => {
    return await ApiService.post<ResponseDto<null>>(
      `${EXTENDED_BASE_URL}/send`,
      request,
    );
  },
  storeFcmToken: async (tokenDto: StoreFcmTokenDto) => {
    return await ApiService.post<ResponseDto<null>>(
      `${EXTENDED_BASE_URL}/store-token`,
      tokenDto,
    );
  },
};
export default notificationsApi;
