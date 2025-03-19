import { DeleteChannelRequestDto } from "@/types/deleteRequest.ts";
import directMessagingApi from "@/services/api/directMessagingApi.ts";

function useDeleteRequest() {
  const sendDeleteRequest = async (
    deleteRequestDto: DeleteChannelRequestDto,
  ) => {
    try {
      return await directMessagingApi.requestChannelDelete(deleteRequestDto);
    } catch (error) {
      console.error("Error requesting for delete channel:", error);
      return null;
    }
  };
  return {
    sendDeleteRequest,
  };
}

export default useDeleteRequest;
