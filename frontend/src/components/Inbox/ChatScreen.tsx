import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, MoreHorizontal, Send, Plus } from "lucide-react";
import useChatMessages from "./apiCalls/useChatMessages";
import defaultAvatar from "./SampleImages/defaultAvatar.png";
import defaultGroupAvatar from "./SampleImages/defaultGroupAvatar.png";
import { Message } from "@/components/Inbox/ChatScreen/ChatMessages.tsx";
import "./ChatScreen.css";

const ChatScreen = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Access chat data from location state
  const { state } = location || {};
  const chatName = state?.chatName || "Chat";
  const chatAvatar = state?.chatAvatar || defaultAvatar;
  const chatType = state?.chatType || "individual"; // Default to individual chat
  const channelId = state?.channelId || 1; // Use a default channel ID for testing

  // Use custom hook to fetch messages
  const { messages, setMessages, loading, error } = useChatMessages(channelId);

  const [newMessage, setNewMessage] = useState("");

  // Handle sending a new message
  const handleSend = () => {
    if (newMessage.trim() === "") return; // Do nothing if the input is empty

    // Add the new message to the messages array locally
    setMessages((prevMessages: Message[]) => [
      ...prevMessages,
      {
        id: prevMessages.length + 1,
        sender: "You",
        text: newMessage,
        time: "Just now",
      },
    ]);

    // Clear the input field
    setNewMessage("");
  };

  // Handle loading and error states
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

  return (
    <div id={"chatScreenMainCtn"} className="flex flex-col h-screen bg-gray-100">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3 bg-white shadow">
        {/* Back Button */}
        <button
          className="p-2 rounded-full bg-white hover:bg-gray-300"
          onClick={() => navigate(-1)} // Navigate back to previous page
        >
          <ArrowLeft className="text-gray-800" size={24} />
        </button>

        {/* Chat Information */}
        <div className="flex items-center gap-3">
          <img
            src={chatAvatar}
            alt={chatName}
            className="w-10 h-10 rounded-full object-cover"
          />
          <h1 className="text-lg font-bold text-gray-800">{chatName}</h1>
        </div>

        {/* Options Button */}
        <button className="p-2 rounded-full bg-gray-200 hover:bg-gray-300">
          <MoreHorizontal className="text-gray-800" size={24} />
        </button>
      </header>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-3">
        {messages.map((message) => (
          <div key={message.id} className="mb-4">
            {/* Timestamp */}
            {message.time && (
              <div className="text-xs text-gray-500 text-center mb-2">
                {message.time}
              </div>
            )}
            {/* Message Bubble */}
            <div
              className={`flex ${
                message.sender === "You" ? "justify-end" : "justify-start"
              } items-center gap-3`}
            >
              {/* Sender Avatar */}
              {message.sender !== "You" && (
                <img
                  src={
                    message.senderAvatar ||
                    (chatType === "group"
                      ? defaultGroupAvatar // Use local image for group member avatars
                      : chatAvatar)
                  }
                  alt={message.sender}
                  className="w-8 h-8 rounded-full object-cover"
                />
              )}
              {/* Message Text */}
              <div
                className={`px-4 py-2 rounded-lg ${
                  message.sender === "You"
                    ? "bg-secondaryColour text-white"
                    : "bg-gray-200 text-gray-800"
                }`}
              >
                {/* Display sender's name in group chats */}
                {chatType === "group" && message.sender !== "You" && (
                  <p className="text-xs font-bold">{message.sender}</p>
                )}
                <p className="text-sm">{message.text}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Message Input Area */}
      <div className="flex items-center gap-3 px-4 py-3 bg-white shadow">
        {/* Attachment Button */}
        <button className="p-3 rounded-full bg-gray-200 hover:bg-gray-300">
          <Plus className="text-gray-800" size={24} />
        </button>

        {/* Text Input */}
        <input
          type="text"
          placeholder="Send a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="flex-1 px-4 py-2 border bg-white rounded-full text-sm focus:outline-none"
        />

        {/* Send Button */}
        <button
          className={`p-3 rounded-full ${
            newMessage.trim() === ""
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-secondaryColour hover:bg-secondaryColour-light"
          }`}
          onClick={handleSend}
          disabled={newMessage.trim() === ""}
        >
          <Send className="text-white" size={24} />
        </button>
      </div>
    </div>
  );
};

export default ChatScreen;
