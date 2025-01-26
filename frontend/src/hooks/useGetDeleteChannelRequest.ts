import directMessagingApi from "@/services/api/directMessagingApi.ts";

function useGetDeleteChannelRequest() {
  return {
    getDeleteChannelRequest: async (channelId: number) => {
      try {
        return await directMessagingApi.getIsDeleteChannelRequestActive(channelId);
      } catch (err) {
        console.error("Error deleting channel:", err);
        return "Failed to delete channel.";
      }
    }
  }
}
export default useGetDeleteChannelRequest();