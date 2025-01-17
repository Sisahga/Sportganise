import {BlockUserRequestDto} from "@/types/blocklist.ts";

const baseMappingUrl = import.meta.env.VITE_API_BASE_URL + "/api/blocklist";

const blocklistApi = {
  blockUser: async (blockUserRequestDto: BlockUserRequestDto) => {
    console.log("Block user request object sending to api: ", blockUserRequestDto);
    const response = await fetch(
        `${baseMappingUrl}/block`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(blockUserRequestDto)
        },
    );
    return response.status;
  },
  unblockUser: async (blockUserRequestDto: BlockUserRequestDto) => {
    console.log("Unblock user request object sending to api: ", blockUserRequestDto);
    const response = await fetch(
        `${baseMappingUrl}/unblock/${blockUserRequestDto.accountId}/${blockUserRequestDto.blockedId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          }
        },
    );
    return response.status;
  }
}
export default blocklistApi;