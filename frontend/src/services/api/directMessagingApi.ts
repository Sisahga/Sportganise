import { ApiService } from "@/services/apiHelper.ts";
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

const EXTENDED_BASE_URL = "/api/messaging";

const directMessagingApi = {
  createChannel: async (
    channel: CreateChannelDto,
    creatorId: number,
  ): Promise<ResponseDto<CreateChannelDto>> => {
    return await ApiService.post<ResponseDto<CreateChannelDto>>(
      `${EXTENDED_BASE_URL}/channel/create-channel/${creatorId}`,
      channel,
    );
  },
  getChannels: async (accountId: number | null) => {
    const response = await ApiService.get<ResponseDto<Channel[]>>(
      `${EXTENDED_BASE_URL}/channel/get-channels/${accountId}`,
    );
    if (response.statusCode === 200 && response.data) {
      return response.data;
    } else {
      log.debug("Error fetching channels:", response);
    }
  },
  getNonUserChannelMembers: async (channelId: number, userId: number) => {
    return await ApiService.get<ResponseDto<ChannelMember[]>>(
      `${EXTENDED_BASE_URL}/channelmember/get-channel-members/${channelId}/${userId}`,
    );
  },
  getAllChannelMembers: async (channelId: number) => {
    return await ApiService.get<ResponseDto<ChannelMember[]>>(
      `${EXTENDED_BASE_URL}/channelmember/get-channel-members/${channelId}`,
    );
  },
  getDirectMessages: async (channelId: number | null, lastSentAt?: string) => {
    let url = `${EXTENDED_BASE_URL}/directmessage/get-messages/${channelId}`;

    // Timestamp for pagination
    if (lastSentAt) {
      url += `?lastSentAt=${encodeURIComponent(lastSentAt)}`;
    }

    const response = await ApiService.get<ResponseDto<MessageComponent[]>>(url);

    if (response.statusCode === 200 && response.data) {
      return response.data;
    } else {
      log.debug("Error fetching messages:", response);
    }
  },
  markChannelAsRead: async (
    channelId: number,
    userId: number,
  ): Promise<void> => {
    await ApiService.put<ResponseDto<void>>(
      `${EXTENDED_BASE_URL}/channelmember/${channelId}/${userId}/mark-as-read`,
      {},
    );
    log.info(`Channel ${channelId} marked as read for user ${userId}`);
  },
  getLastChannelMessage: async (channelId: number) => {
    return await ApiService.get<ResponseDto<LastMessageComponent>>(
      `${EXTENDED_BASE_URL}/channel/get-last-message/${channelId}`,
    );
  },
  removeChannelMember: async (channelId: number, accountId: number) => {
    return await ApiService.delete<ResponseDto<null>>(
      `${EXTENDED_BASE_URL}/channelmember/remove/${channelId}/${accountId}`,
    );
  },
  addChannelMembers: async (channelMembersDto: AddChannelMemberDto) => {
    return await ApiService.post<ResponseDto<null>>(
      `${EXTENDED_BASE_URL}/channelmember/add-members`,
      channelMembersDto,
    );
  },
  renameChannel: async (renameChannelDto: RenameChannelDto) => {
    return await ApiService.put<ResponseDto<null>>(
      `${EXTENDED_BASE_URL}/channel/rename-channel`,
      renameChannelDto,
    );
  },
  updateChannelPicture: async (requestData: FormData) => {
    return await ApiService.post<ResponseDto<UpdateChannelPictureResponse>>(
      `${EXTENDED_BASE_URL}/channel/update-image`,
      requestData,
      {
        isMultipart: true,
      },
    );
  },
  requestChannelDelete: async (
    deleteChannelRequestDto: DeleteChannelRequestDto,
  ) => {
    const response = await ApiService.post<
      ResponseDto<DeleteChannelRequestResponseDto | null>
    >(
      `${EXTENDED_BASE_URL}/channel/delete-channel-request`,
      deleteChannelRequestDto,
    );

    if (response.statusCode === 204) {
      const data: ResponseDto<null> = {
        statusCode: 204,
        message: "Channel immediately and successfully deleted.",
        data: null,
      };
      return data;
    } else {
      return response;
    }
  },
  getIsDeleteChannelRequestActive: async (channelId: number) => {
    const response = await ApiService.get<
      ResponseDto<DeleteChannelRequestResponseDto | null>
    >(`${EXTENDED_BASE_URL}/channel/delete-request-active/${channelId}`);
    if (response.statusCode === 204) {
      const data: ResponseDto<null> = {
        statusCode: 204,
        message: "No delete request found",
        data: null,
      };
      return data;
    } else {
      return response;
    }
  },
  setApproverDeleteStatus: async (
    setDeleteApproverStatusDto: SetDeleteApproverStatusDto,
  ) => {
    const response = await ApiService.patch<
      ResponseDto<DeleteChannelRequestResponseDto | null>
    >(
      `${EXTENDED_BASE_URL}/channel/set-delete-approver-status`,
      setDeleteApproverStatusDto,
    );
    log.info("Set Approver Delete Status Response:", response);
    if (response.statusCode === 204) {
      const data: ResponseDto<null> = {
        statusCode: 204,
        message: "No delete request found",
        data: null,
      };
      log.info("Channel denied deletion.");
      return data;
    } else {
      return response;
    }
  },
  uploadAttachments: async (formData: FormData) => {
    return await ApiService.post<ResponseDto<MessageComponent>>(
      `${EXTENDED_BASE_URL}/directmessage/upload-attachments`,
      formData,
      {
        isMultipart: true,
      },
    );
  },
};

export default directMessagingApi;
