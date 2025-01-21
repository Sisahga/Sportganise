import blocklistApi from "@/services/api/blocklistApi.ts";
import { BlockUserRequestDto } from "@/types/blocklist.ts";

function useUnblockUser() {
  const unblockUser = async (blockListRequestDto: BlockUserRequestDto) => {
    try {
      return await blocklistApi.unblockUser(blockListRequestDto);
    } catch (error) {
      console.error("Error blocking user:", error);
      return null;
    }
  };

  return {
    unblockUser,
  };
}

export default useUnblockUser;
