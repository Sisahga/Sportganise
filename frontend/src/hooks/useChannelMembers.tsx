import {useEffect, useState} from "react";
import {ChannelMember} from "@/types/dmchannels.ts";
import directMessagingApi from "@/services/api/directMessagingApi.ts";

const useChannelMembers = (channelId: number, userId: number, channelType: string) => {
  const [members, setMembers] = useState<ChannelMember[]>([]);

  const fetchChannelMembers = async () => {
    try {
      if (channelType === "SIMPLE") {
        const response = await directMessagingApi.getNonUserChannelMembers(channelId, userId);
        setMembers(response);
      } else {
        const response = await directMessagingApi.getAllChannelMembers(channelId);
        setMembers(response);
      }
    } catch (error) {
      console.error("Error fetching channel members: ", error);
    }
  }

  useEffect(() => {
    fetchChannelMembers().then(r => r);
  }, [channelId]);

  return {
    members,
  };
}
export default useChannelMembers;