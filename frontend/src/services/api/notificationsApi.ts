import { getBearerToken } from "@/services/apiHelper";
import {
  StoreFcmTokenDto,
  NotificationRequest,
  NotificationSettings,
  UpdateNotificationMethodRequestDto,
  UpdateNotificationPermissionRequestDto,
} from "@/types/notifications.ts";
import ResponseDto from "@/types/response.ts";

const BASE_API_URL = import.meta.env.VITE_API_BASE_URL + "/api/notifications";

const notificationsApi = {
  getNotificationSettings: async (userId: number) => {
    const response = await fetch(
      `${BASE_API_URL}/get-notif-settings/${userId}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: getBearerToken(),
        },
      },
    );
    const data: ResponseDto<NotificationSettings> = await response.json();
    console.log("Notif settings: ", data);
    return data;
  },
  updateNotificationMethod: async (
    request: UpdateNotificationMethodRequestDto,
  ) => {
    const response = await fetch(`${BASE_API_URL}/update-notification-method`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: getBearerToken(),
      },
      body: JSON.stringify(request),
    });
    const data: ResponseDto<null> = await response.json();
    return data;
  },
  updateNotificationPermission: async (
    request: UpdateNotificationPermissionRequestDto,
  ) => {
    const response = await fetch(
      `${BASE_API_URL}/update-notification-permission`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: getBearerToken(),
        },
        body: JSON.stringify(request),
      },
    );
    const data: ResponseDto<null> = await response.json();
    return data;
  },
  sendNotification: async (request: NotificationRequest) => {
    return await fetch(`${BASE_API_URL}/send`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: getBearerToken(),
      },
      body: JSON.stringify(request),
    });
  },
  storeFcmToken: async (tokenDto: StoreFcmTokenDto) => {
    return await fetch(`${BASE_API_URL}/store-token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: getBearerToken(),
      },
      body: JSON.stringify(tokenDto),
    });
  },
};
export default notificationsApi;
