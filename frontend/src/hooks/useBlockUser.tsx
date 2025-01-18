import blocklistApi from "@/services/api/blocklistApi.ts";
import { BlockUserRequestDto } from "@/types/blocklist.ts";

function useBlockUser() {
  const blockUser = async (blockListRequestDto: BlockUserRequestDto) => {
    try {
      return await blocklistApi.blockUser(blockListRequestDto);
    } catch (error) {
      console.error("Error blocking user:", error);
      return null;
    }
  };

  return {
    blockUser,
  };
}

export default useBlockUser;
