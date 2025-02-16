import { getBearerToken } from "@/services/apiHelper.ts";
import {
  AddChannelMemberDto,
  Channel,
  ChannelMember,
  CreateChannelDto,
  RenameChannelDto,
  UpdateChannelPictureResponse,
} from "@/types/dmchannels.ts";
import {
  DeleteChannelRequestDto,
  DeleteChannelRequestResponseDto,
  SetDeleteApproverStatusDto,
} from "@/types/deleteRequest.ts";
import { LastMessageComponent, MessageComponent } from "@/types/messaging.ts";
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
          Authorization: getBearerToken(),
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
      {
        headers: {
          Authorization: getBearerToken(),
        },
      },
    );
    const data: Channel[] = await response.json();
    return data;
  },
  getNonUserChannelMembers: async (channelId: number, userId: number) => {
    const response = await fetch(
      `${baseMappingUrl}/channelmember/get-channel-members/${channelId}/${userId}`,
      {
        headers: {
          Authorization: getBearerToken(),
        },
      },
    );
    const data: ResponseDto<ChannelMember[]> = await response.json();
    return data;
  },
  getAllChannelMembers: async (channelId: number) => {
    const response = await fetch(
      `${baseMappingUrl}/channelmember/get-channel-members/${channelId}`,
      {
        headers: {
          Authorization: getBearerToken(),
        },
      },
    );
    const data: ResponseDto<ChannelMember[]> = await response.json();
    return data;
  },
  getDirectMessages: async (channelId: number | null) => {
    const response = await fetch(
      `${baseMappingUrl}/directmessage/get-messages/${channelId}`,
      {
        headers: {
          Authorization: getBearerToken(),
        },
      },
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
        headers: {
          Authorization: getBearerToken(),
        },
      },
    );
    log.info(`Channel ${channelId} marked as read for user ${userId}`);
  },
  getLastChannelMessage: async (channelId: number) => {
    const response = await fetch(
      `${baseMappingUrl}/channel/get-last-message/${channelId}`,
      {
        headers: {
          Authorization: getBearerToken(),
        },
      },
    );
    const data: ResponseDto<LastMessageComponent> = await response.json();
    return data;
  },
  removeChannelMember: async (channelId: number, accountId: number) => {
    return await fetch(
      `${baseMappingUrl}/channelmember/remove/${channelId}/${accountId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: getBearerToken(),
        },
      },
    );
  },
  addChannelMembers: async (channelMembersDto: AddChannelMemberDto) => {
    return await fetch(`${baseMappingUrl}/channelmember/add-members`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: getBearerToken(),
      },
      body: JSON.stringify(channelMembersDto),
    });
  },
  renameChannel: async (renameChannelDto: RenameChannelDto) => {
    return await fetch(`${baseMappingUrl}/channel/rename-channel`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: getBearerToken(),
      },
      body: JSON.stringify(renameChannelDto),
    });
  },
  updateChannelPicture: async (requestData: FormData) => {
    const response = await fetch(`${baseMappingUrl}/channel/update-image`, {
      method: "POST", // Its a more complex backend, so we need to use POST here.
      headers: {
        Authorization: getBearerToken(),
      },
      body: requestData,
    });
    const data: ResponseDto<UpdateChannelPictureResponse> =
      await response.json();
    return data;
  },
  requestChannelDelete: async (
    deleteChannelRequestDto: DeleteChannelRequestDto,
  ) => {
    const response = await fetch(
      `${baseMappingUrl}/channel/delete-channel-request`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: getBearerToken(),
        },
        body: JSON.stringify(deleteChannelRequestDto),
      },
    );
    if (response.status === 204) {
      const data: ResponseDto<null> = {
        statusCode: 204,
        message: "Channel immediately and successfully deleted.",
        data: null,
      };
      return data;
    } else {
      const data: ResponseDto<DeleteChannelRequestResponseDto> =
        await response.json();
      return data;
    }
  },
  getIsDeleteChannelRequestActive: async (channelId: number) => {
    const response = await fetch(
      `${baseMappingUrl}/channel/delete-request-active/${channelId}`,
      {
        headers: {
          Authorization: getBearerToken(),
        },
      },
    );
    if (response.status === 204) {
      const data: ResponseDto<null> = {
        statusCode: 204,
        message: "No delete request found",
        data: null,
      };
      return data;
    } else if (response.status === 200) {
      const data: ResponseDto<DeleteChannelRequestResponseDto> =
        await response.json();
      return data;
    } else {
      const data: ResponseDto<null> = {
        statusCode: response.status,
        message: "Error fetching delete request.",
        data: null,
      };
      return data;
    }
  },
  setApproverDeleteStatus: async (
    setDeleteApproverStatusDto: SetDeleteApproverStatusDto,
  ) => {
    const response = await fetch(
      `${baseMappingUrl}/channel/set-delete-approver-status`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: getBearerToken(),
        },
        body: JSON.stringify(setDeleteApproverStatusDto),
      },
    );
    log.info("Set Approver Delete Status Response:", response);
    if (response.status === 204) {
      const data: ResponseDto<null> = {
        statusCode: 204,
        message: "No delete request found",
        data: null,
      };
      log.info("Channel denied deletion.");
      return data;
    } else if (response.status === 200) {
      const data: ResponseDto<DeleteChannelRequestResponseDto> =
        await response.json();
      return data;
    } else {
      const data: ResponseDto<null> = {
        statusCode: response.status,
        message: "Error fetching delete request.",
        data: null,
      };
      return data;
    }
  },
  uploadAttachments: async (formData: FormData) => {
    const response = await fetch(`${baseMappingUrl}/directmessage/upload-attachments`, {
      method: "POST",
      headers: {
        Authorization: getBearerToken(),
      },
      body: formData,
    });
    const data: ResponseDto<MessageComponent> = await response.json();
    return data;
  }
};

export default directMessagingApi;
