import { getBearerToken } from "@/services/apiHelper";
import {
  StoreFcmTokenDto,
  NotificationRequest,
} from "@/types/notifications.ts";

const BASE_API_URL = import.meta.env.VITE_API_BASE_URL + "/api/notifications";

const notificationsApi = {
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
