import { BlockUserRequestDto } from "@/types/blocklist.ts";
import { getBearerToken } from "@/services/apiHelper.ts";

const baseMappingUrl = import.meta.env.VITE_API_BASE_URL + "/api/blocklist";

const blocklistApi = {
  blockUser: async (blockUserRequestDto: BlockUserRequestDto) => {
    console.log(
      "Block user request object sending to api: ",
      blockUserRequestDto,
    );
    const response = await fetch(`${baseMappingUrl}/block`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: getBearerToken(),
      },
      body: JSON.stringify(blockUserRequestDto),
    });
    return response.status;
  },
  unblockUser: async (blockUserRequestDto: BlockUserRequestDto) => {
    console.log(
      "Unblock user request object sending to api: ",
      blockUserRequestDto,
    );
    const response = await fetch(
      `${baseMappingUrl}/unblock/${blockUserRequestDto.accountId}/${blockUserRequestDto.blockedId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: getBearerToken(),
        },
      },
    );
    return response.status;
  },
};
export default blocklistApi;
