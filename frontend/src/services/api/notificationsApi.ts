import { getBearerToken } from "@/services/apiHelper";
import { NotificationRequest } from "@/types/notifications.ts";

const BASE_API_URL = import.meta.env.VITE_API_BASE_URL + "/api/notifications";

const notificationsApi = {
  sendNotification: (request: NotificationRequest) => {
    return fetch(`${BASE_API_URL}/send`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: getBearerToken(),
      },
      body: JSON.stringify(request),
    });
  },
};
export default notificationsApi;
