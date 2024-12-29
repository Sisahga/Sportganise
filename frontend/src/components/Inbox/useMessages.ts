// useMessages.ts
import { useState, useEffect } from "react";

interface Message {
  channelId: number;
  channelType: string;
  channelName: string;
  channelImageBlob: string;
  lastMessage: string | null;
  read: boolean;
  lastEvent: string | null;
}

function useMessages() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Simulate data fetching with a timeout
    const fetchData = async () => {
      try {
        // Mock data
        const mockMessages: Message[] = [
          {
            channelId: 1,
            channelType: "GROUP",
            channelName: "Mock Group Chat",
            channelImageBlob: "/assets/defaultGroupAvatar.png",
            lastMessage: "This is the last message in the group chat.",
            read: false,
            lastEvent: new Date().toISOString(),
          },
          {
            channelId: 2,
            channelType: "INDIVIDUAL",
            channelName: "John Doe",
            channelImageBlob: "/assets/defaultAvatar.png",
            lastMessage: "Hey, how are you?",
            read: true,
            lastEvent: new Date().toISOString(),
          },
        ];
        setMessages(mockMessages);
      } catch (err) {
        console.error("Error fetching messages:", err);
        setError("Failed to fetch messages.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { messages, loading, error };
}

export default useMessages;
