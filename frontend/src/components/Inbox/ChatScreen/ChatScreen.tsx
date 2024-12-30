// ChatScreen.tsx
import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import useChatMessages from "../apiCalls/useChatMessages";
import useDeleteChannel from "../apiCalls/useDeleteChannel";
import useBlockUser from "../apiCalls/useBlockUser";
import ChatHeader from "./ChatHeader";
import ChatMessages from "./ChatMessages";
import ChatInput from "./ChatInput";

const ChatScreen: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { state } = location || {};
  const chatName = state?.chatName || "Chat";
  const chatAvatar = state?.chatAvatar; // optional
  const chatType = state?.chatType || "individual";
  const channelId = state?.channelId || 1; // fallback ID for testing

  // 1) Fetch messages
  const { messages, setMessages, loading, error } = useChatMessages(channelId);

  // 2) Delete channel
  const { deleteChannel } = useDeleteChannel();

  // 3) Block user
  const { blockUser } = useBlockUser();

  // For debug:
  useEffect(() => {
    console.log("ChatScreen state:", state);
    console.log("messages:", messages);
    console.log("loading:", loading, "error:", error);
  }, [state, messages, loading, error]);

  // Handlers
  const handleSendMessage = (messageText: string) => {
    setMessages((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        sender: "You",
        text: messageText,
        time: "Just now",
      },
    ]);
  };

  const handleDeleteChat = async (chanId: number) => {
    if (!window.confirm("Are you sure you want to delete this chat?")) return;
    try {
      await deleteChannel(chanId);
      navigate(-1);
    } catch (err: any) {
      alert(err.message || "Could not delete channel");
    }
  };

  const handleBlockUser = async () => {
    if (!window.confirm("Block this user?")) return;
    try {
      await blockUser(9999);
      alert("User blocked!");
    } catch (err: any) {
      alert(err.message || "Could not block user");
    }
  };

  // If loading or error
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Loading chat...</p>
      </div>
    );
  }
  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  // Render the screen if not loading/error
  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <ChatHeader
        chatName={chatName}
        chatAvatar={chatAvatar || ""}
        channelId={channelId}
        chatType={chatType}
        onDeleteChat={handleDeleteChat}
        onBlockUser={handleBlockUser}
      />

      <ChatMessages
        messages={messages}
        chatAvatar={chatAvatar || ""}
        chatType={chatType}
      />

      <ChatInput onSend={handleSendMessage} />
    </div>
  );
};

export default ChatScreen;
