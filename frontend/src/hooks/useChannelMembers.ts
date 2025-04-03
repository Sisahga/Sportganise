import { useCallback, useState } from "react";
import { ChannelMember } from "@/types/dmchannels.ts";
import directMessagingApi from "@/services/api/directMessagingApi.ts";

const useChannelMembers = (channelId: number, channelType: string) => {
  const [members, setMembers] = useState<ChannelMember[]>([]);

  const fetchChannelMembers = useCallback(
    async (userId: number) => {
      try {
        if (channelType === "SIMPLE") {
          const response = await directMessagingApi.getNonUserChannelMembers(
            channelId,
            userId,
          );
          setMembers(response.data ?? []);
        } else {
          const response =
            await directMessagingApi.getAllChannelMembers(channelId);
          setMembers(response.data ?? []);
        }
      } catch (error) {
        console.error("Error fetching channel members: ", error);
      }
    },
    [channelId, channelType],
  );

  return {
    fetchChannelMembers,
    members,
  };
};
export default useChannelMembers;
