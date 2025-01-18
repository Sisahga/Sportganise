import { useEffect, useState } from "react";
import { LastMessageComponent } from "@/types/messaging.ts";
import directMessagingApi from "@/services/api/directMessagingApi.ts";

const useLastMessage = (channelId: number) => {
  const [lastMessage, setLastMessage] = useState<LastMessageComponent | null>(
    null,
  );
  useEffect(() => {
    const fetchLastMessage = async () => {
      try {
        directMessagingApi.getLastChannelMessage(channelId).then((response) => {
          setLastMessage(response.data);
        });
      } catch (err) {
        console.error("Error fetching last message:", err);
      }
    };

    fetchLastMessage().then((r) => r);
  }, [channelId]);

  useEffect(() => {
    console.log("Last message: ", lastMessage);
  }, [lastMessage]);
  return {
    lastMessage,
  };
};
export default useLastMessage;
