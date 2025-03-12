import { FcmTokenDto } from "@/types/notifications.ts";
import notificationsApi from "@/services/api/notificationsApi.ts";

function useStoreFcmToken() {
  const storeFcmToken = async (fcmTokenDto: FcmTokenDto) => {
    return notificationsApi.storeFcmToken(fcmTokenDto);
  };
  return {
    storeFcmToken,
  };
}
export default useStoreFcmToken;
