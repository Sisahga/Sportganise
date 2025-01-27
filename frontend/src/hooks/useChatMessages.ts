import { useState, useEffect } from "react";
import { MessageComponent } from "@/types/messaging.ts";
import directMessagingApi from "@/services/api/directMessagingApi.ts";
import {getAccountIdCookie, getCookies} from "@/services/cookiesService.ts";

function useChatMessages(channelId: number, read: boolean) {
  const [messages, setMessages] = useState<MessageComponent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const cookies = getCookies();
  const userId = getAccountIdCookie(cookies);

  const fetchMessages = async () => {
    try {
      directMessagingApi.getDirectMessages(channelId).then((response) => {
        setMessages(response);
        if (!read) {
          directMessagingApi.markChannelAsRead(channelId, userId);
        }
      });
    } catch (err) {
      console.error("Error fetching chat messages:", err);
      setError("Failed to load messages.");
    }
  };

  useEffect(() => {
    if (!channelId) {
      setError("Invalid channel ID");
      setLoading(false);
      return;
    }
    fetchMessages().then(() => {
      setLoading(false);
    });
  }, []);

  return {
    messages,
    setMessages,
    loading,
    error,
  };
}

export default useChatMessages;
