// ChatScreen.tsx
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import useChatMessages from "../apiCalls/useChatMessages";
import useDeleteChannel from "../apiCalls/useDeleteChannel";
import useBlockUser from "../apiCalls/useBlockUser";
import ChatHeader from "./ChatHeader";
import ChatMessages from "./ChatMessages";
import ChatInput from "./ChatInput";
import defaultAvatar from "../SampleImages/defaultAvatar.png";

const ChatScreen: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { state } = location || {};
  const chatName = state?.chatName || "Chat";
  const chatAvatar = state?.chatAvatar || defaultAvatar;
  const chatType = state?.chatType || "individual";
  const channelId = state?.channelId || 1;

  // 1) For fetching messages
  const { messages, setMessages, loading, error } = useChatMessages(channelId);

  // 2) For deleting a channel
  const { deleteChannel } = useDeleteChannel();

  // 3) For blocking a user
  const { blockUser } = useBlockUser();

  // Send a new message
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

  // Delete channel handler
  const handleDeleteChat = async (chanId: number) => {
    const confirmed = window.confirm("Are you sure you want to delete this chat?");
    if (!confirmed) return;

    try {
      await deleteChannel(chanId);
      // If successful, navigate back
      navigate(-1);
    } catch (err: any) {
      console.error("Error deleting channel:", err);
      alert(err.message || "Could not delete channel.");
    }
  };

  // Block user handler
  const handleBlockUser = async () => {
    const confirmed = window.confirm("Block this user?");
    if (!confirmed) return;

    try {
      // For demonstration, we assume a user ID to block
      const userIdToBlock = 9999;
      await blockUser(userIdToBlock);
      alert("User blocked!");
    } catch (err: any) {
      console.error("Error blocking user:", err);
      alert(err.message || "Could not block user.");
    }
  };

  // loading & error states
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Loading...</p>
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

  // Render
  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <ChatHeader
        chatName={chatName}
        chatAvatar={chatAvatar}
        channelId={channelId}
        chatType={chatType}
        onDeleteChat={handleDeleteChat}
        onBlockUser={handleBlockUser}
      />

      <ChatMessages
        messages={messages}
        chatAvatar={chatAvatar}
        chatType={chatType}
      />

      <ChatInput onSend={handleSendMessage} />
    </div>
  );
};

export default ChatScreen;
