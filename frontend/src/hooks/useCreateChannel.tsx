import {CreateChannelDto} from "@/types/dmchannels.ts";
import directMessagingApi from "@/services/api/directMessagingApi.ts";
import {useState} from "react";
import ResponseDto from "@/types/response.ts";

function useCreateChannel() {
  const [channelResponse, setChannelResponse] = useState<ResponseDto<CreateChannelDto> | null>(null);
  const createChannel =
      async (newChannelDetails: CreateChannelDto, creatorId: number) => {
    try {
      const response =
          await directMessagingApi.createChannel(newChannelDetails, creatorId);
      setChannelResponse(response);
      return response;
    } catch (err) {
      console.error("Error creating channel:", err);
      return null;
    }
  };

  return {
    channelResponse, createChannel
  }
}

export default useCreateChannel;