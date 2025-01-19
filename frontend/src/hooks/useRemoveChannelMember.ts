import directMessagingApi from "@/services/api/directMessagingApi.ts";

function useRemoveChannelMember() {
  const removeChannelMember =
      async (channelId: number, memberId: number) => {
    try {
      return await directMessagingApi.removeChannelMember(channelId, memberId);
    } catch (error) {
      console.error("Error removing channel member:", error);
      return null;
    }
  }
  return {
    removeChannelMember
  }
}
export default useRemoveChannelMember;