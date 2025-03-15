import { getBearerToken } from "@/services/apiHelper";
import {
  StoreFcmTokenDto,
  NotificationRequest,
  NotificationSettings,
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
