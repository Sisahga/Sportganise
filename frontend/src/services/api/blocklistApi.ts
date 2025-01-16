import ResponseDto from "@/types/response.ts";
import {BlockUserRequestDto} from "@/types/blocklist.ts";

const baseMappingUrl = import.meta.env.VITE_API_BASE_URL + "/api/blocklist";

const blocklistApi = {
  blockUser: async (blockUserRequestDto: BlockUserRequestDto ) => {
    const response = await fetch(
        `${baseMappingUrl}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({blockUserRequestDto})
        },
    );
    const data: ResponseDto<null> = await response.json();
    return data;
  }
}
export default blocklistApi;