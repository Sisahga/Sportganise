import directMessagingApi from "@/services/api/directMessagingApi.ts";
import log from "loglevel";
import { useCallback, useState } from "react";
import { Channel } from "@/types/dmchannels.ts";

const useGetChannels = () => {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [unreadChannelCount, setUnreadChannelCount] = useState<number>(0);

  const fetchChannels = useCallback(async (userId: number) => {
    try {
      const response = await directMessagingApi.getChannels(userId);
      setChannels(response);
      response.forEach((channel) => {
        if (!channel.read) {
          setUnreadChannelCount((prev) => prev + 1);
        }
      });
      setLoading(false);
    } catch (err) {
      log.error("Error fetching chat messages:", err);
      setError("Failed to load messages.");
    }
  }, []);

  return {
    channels,
    error,
    loading,
    unreadChannelCount,
    fetchChannels,
  };
};
export default useGetChannels;
