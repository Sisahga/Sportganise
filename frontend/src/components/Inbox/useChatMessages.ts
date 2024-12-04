// useChatMessages.ts
import { useState, useEffect } from "react";

interface Message {
  id: number;
  sender: string;
  text: string;
  time: string;
  senderAvatar?: string;
}

function useChatMessages(
  channelId: number | null,
): [
  Message[],
  React.Dispatch<React.SetStateAction<Message[]>>,
  boolean,
  string | null,
] {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!channelId) {
      setError("Invalid channel ID");
      setLoading(false);
      return;
    }

    // Simulate fetching messages with mock data
    const fetchMessages = async () => {
      try {
        // Mock data
        const mockMessages: Message[] = [
          {
            id: 1,
            sender: "John Doe",
            text: "Hello! This is a mock message.",
            time: "10:00 AM",
            senderAvatar: "/assets/defaultAvatar.png",
          },
          {
            id: 2,
            sender: "You",
            text: "Hi! How are you?",
            time: "10:05 AM",
          },
          {
            id: 3,
            sender: "John Doe",
            text: "I'm good, thanks!",
            time: "10:10 AM",
            senderAvatar: "/assets/defaultAvatar.png",
          },
        ];
        // Simulate network delay
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setMessages(mockMessages);
      } catch (err) {
        console.error("Error fetching chat messages:", err);
        setError("Failed to load messages.");
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [channelId]);

  return [messages, setMessages, loading, error];
}

export default useChatMessages;
