import {Channel, ChannelMember, CreateChannelDto,} from "@/types/dmchannels.ts";
import {LastMessageComponent, MessageComponent} from "@/types/messaging.ts";
import ResponseDto from "@/types/response.ts";
import log from "loglevel";

const baseMappingUrl = import.meta.env.VITE_API_BASE_URL + "/api/messaging";

const directMessagingApi = {
  createChannel: async (
    channel: CreateChannelDto,
    creatorId: number,
  ): Promise<ResponseDto<CreateChannelDto>> => {
    const response = await fetch(
      `${baseMappingUrl}/channel/create-channel/${creatorId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(channel),
      },
    );
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
  getNonUserChannelMembers: async (channelId: number, userId: number) => {
    const response = await fetch(
      `${baseMappingUrl}/channelmember/get-channel-members/${channelId}/${userId}`,
    );
    const data: ResponseDto<ChannelMember[]> = await response.json();
    return data;
  },
  getAllChannelMembers: async (channelId: number) => {
    const response = await fetch(
      `${baseMappingUrl}/channelmember/get-channel-members/${channelId}`,
    );
    const data: ResponseDto<ChannelMember[]> = await response.json();
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
    log.info(`Channel ${channelId} marked as read for user ${userId}`);
  },
  getLastChannelMessage: async (channelId: number) => {
    const response = await fetch(
      `${baseMappingUrl}/channel/get-last-message/${channelId}`,
    );
    const data: ResponseDto<LastMessageComponent> = await response.json();
    return data;
  },
  removeChannelMember: async (channelId: number, accountId: number) => {
    return await fetch(
        `${baseMappingUrl}/channelmember/remove/${channelId}/${accountId}`,
        {
          method: "DELETE",
        },
    );
  }
};

export default directMessagingApi;
