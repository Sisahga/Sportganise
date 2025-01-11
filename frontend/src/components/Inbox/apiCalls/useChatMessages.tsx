import { useState, useEffect } from "react";
import { MessageComponent } from "@/types/messaging";
import directMessagingApi from "@/services/api/directMessagingApi";

function useChatMessages(channelId: number, read: boolean) {
  const [messages, setMessages] = useState<MessageComponent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const userId = 2; // TODO: Replace with actual user ID from cookies

  const fetchMessages = async () => {
    try {
      directMessagingApi.getDirectMessages(channelId).then(
        (response) => {
          setMessages(response);
          if (!read) {
            directMessagingApi.markChannelAsRead(channelId, userId);
          }
        }
      );
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
  }, [channelId]);

  return {
    messages,
    setMessages,
    loading,
    error,
  };
}

export default useChatMessages;
