import { StoreFcmTokenDto } from "@/types/notifications.ts";
import notificationsApi from "@/services/api/notificationsApi.ts";

function useStoreFcmToken() {
  const storeFcmToken = (fcmTokenDto: StoreFcmTokenDto) => {
    return notificationsApi.storeFcmToken(fcmTokenDto);
  };
  return {
    storeFcmToken,
  };
}
export default useStoreFcmToken;
