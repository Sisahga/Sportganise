import {Channel, CreateChannelDto} from "@/types/dmchannels.ts";
import {MessageComponent} from "@/types/messaging.ts";
import ResponseDto from "@/types/response.ts";

const baseMappingUrl = import.meta.env.VITE_API_BASE_URL + "/api/messaging";

const directMessagingApi = {
  createChannel: async (channel: CreateChannelDto, creatorId: number): Promise<ResponseDto<CreateChannelDto>> => {
    const response = await fetch(`${baseMappingUrl}/channel/create-channel/${creatorId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(channel),
    });
    const data = await response.json();
    console.log("Create Channel Response:", data);
    return data;
  },
  getChannels: async (accountId: number | null) => {
    const response = await fetch(
      `${baseMappingUrl}/channel/get-channels/${accountId}`,
    );
    const data: Channel[] = await response.json();
    return data;
  },
  getDirectMessages: async (channelId: number | null) => {
    const response = await fetch(
        `${baseMappingUrl}/directmessage/get-messages/${channelId}`,
    );
    const data: MessageComponent[] = await response.json();
    return data;
  },
  markChannelAsRead: async (
    channelId: number,
    userId: number,
  ): Promise<void> => {
    await fetch(
      `${baseMappingUrl}/channelmember/${channelId}/${userId}/mark-as-read`,
      {
        method: "PUT",
      },
    );
  },
};

export default directMessagingApi;
