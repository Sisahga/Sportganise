import {RenameChannelDto} from "@/types/dmchannels.ts";
import directMessagingApi from "@/services/api/directMessagingApi.ts";

function useRenameChannel() {
  const renameChannel = async (renameChannelDto: RenameChannelDto) => {
    try {
      return await directMessagingApi.renameChannel(renameChannelDto);
    } catch (error) {
      console.error("Error renaming channel:", error);
      return null;
    }
  }
  return {
    renameChannel,
  };
}
export default useRenameChannel;