import { useState, useCallback } from "react";
import { MessageComponent } from "@/types/messaging.ts";
import directMessagingApi from "@/services/api/directMessagingApi.ts";
import { MESSAGE_FETCH_LIMIT } from "@/constants/messaging.constants.ts";

function useChatMessages(channelId: number, read: boolean) {
  const [messages, setMessages] = useState<MessageComponent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [hasMoreMessages, setHasMoreMessages] = useState<boolean>(true);
  const [lastSentAt, setLastSentAt] = useState<string | null>(null);

  // Initial fetch of messages
  const fetchMessages = useCallback(
    async (userId: number) => {
      try {
        setLoading(true);
        console.log("Fetching intial messages...");
        const response = await directMessagingApi.getDirectMessages(channelId);
        if (response.length > 0) {
          // Assume that there are more messages if the response length is equal to the fetch limit
          setHasMoreMessages(response.length === MESSAGE_FETCH_LIMIT);
          setLastSentAt(response[response.length - 1].sentAt);
          // Reverse the messages so that the latest message is at the bottom
          response.reverse();
          setMessages(response);

          if (!read) {
            await directMessagingApi.markChannelAsRead(channelId, userId);
          }
        } else {
          setLastSentAt(null);
          setHasMoreMessages(false);
        }
      } catch (err) {
        console.error("Error fetching chat messages:", err);
        setError("Failed to load messages.");
      } finally {
        setLoading(false);
      }
    },
    [channelId],
  );

  // Fetch more messages dynamically
  const fetchMoreMessages = useCallback(async () => {
    if (!hasMoreMessages || loadingMore || !lastSentAt) {
      return;
    }

    try {
      setLoadingMore(true);
      console.log("Fetching more messages...");
      const response = await directMessagingApi.getDirectMessages(
        channelId,
        lastSentAt,
      );

      if (response.length > 0) {
        setHasMoreMessages(response.length === MESSAGE_FETCH_LIMIT);
        setLastSentAt(response[response.length - 1].sentAt);
        response.reverse();
        setMessages((prevMessages) => [...response, ...prevMessages]);
      } else {
        setLastSentAt(null);
        setHasMoreMessages(false);
      }
    } catch (err) {
      console.error("Error fetching more chat messages:", err);
      setError("Failed to load more messages.");
    } finally {
      setLoadingMore(false);
    }
  }, [channelId, hasMoreMessages, loadingMore, lastSentAt]);

  return {
    fetchMessages,
    messages,
    setMessages,
    loading,
    error,
    fetchMoreMessages,
    loadingMore,
    hasMoreMessages,
  };
}

export default useChatMessages;
