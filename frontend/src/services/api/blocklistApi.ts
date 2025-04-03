import { BlockUserRequestDto } from "@/types/blocklist.ts";
import { ApiService } from "@/services/apiHelper.ts";
import log from "loglevel";
import ResponseDto from "@/types/response.ts";

const EXTENDED_BASE_URL = "/api/blocklist";

const blocklistApi = {
  blockUser: async (blockUserRequestDto: BlockUserRequestDto) => {
    log.debug(
      "Block user request object sending to api: ",
      blockUserRequestDto,
    );

    const response = await ApiService.post<ResponseDto<null>>(
      `${EXTENDED_BASE_URL}/block`,
      blockUserRequestDto,
    );

    return response.statusCode;
  },
  unblockUser: async (blockUserRequestDto: BlockUserRequestDto) => {
    log.debug(
      "Unblock user request object sending to api: ",
      blockUserRequestDto,
    );

    const response = await ApiService.delete<ResponseDto<null>>(
      `${EXTENDED_BASE_URL}/unblock/${blockUserRequestDto.accountId}/${blockUserRequestDto.blockedId}`,
    );

    return response.statusCode;
  },
};
export default blocklistApi;
