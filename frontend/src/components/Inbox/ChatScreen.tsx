import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaArrowLeft, FaEllipsisV, FaPaperPlane, FaPlus } from "react-icons/fa";

const ChatScreen = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Access chat data from location state
  const { state } = location;
  const chatName = state?.chatName || "Chat";
  const chatAvatar = state?.chatAvatar || "https://via.placeholder.com/40";
  const chatType = state?.chatType || "individual"; // Default to individual chat

  // Dummy data for chat messages
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: chatType === "group" ? "Member1" : chatName,
      text: "Hello, welcome to the chat!",
      time: "02/28/2024 at 11:30 am",
      senderAvatar: chatAvatar,
    },
    {
      id: 2,
      sender: "You",
      text: "Thanks! Glad to be here.",
      time: "",
    },
    {
      id: 3,
      sender: chatType === "group" ? "Member2" : chatName,
      text: "Looking forward to our discussion.",
      time: "",
      senderAvatar: chatAvatar,
    },
  ]);

  const [newMessage, setNewMessage] = useState("");

  // Handle sending a new message
  const handleSend = () => {
    if (newMessage.trim() === "") return; // Do nothing if the input is empty

    // Add the new message to the messages array
    setMessages((prevMessages) => [
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

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3 bg-white shadow">
        {/* Back Button */}
        <button
          className="p-2 rounded-full bg-white hover:bg-gray-300"
          onClick={() => navigate("/messages")} // Navigate back to messages list
        >
          <FaArrowLeft className="text-gray-800 text-lg" />
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
          <FaEllipsisV className="text-gray-800 text-lg" />
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
                      ? "https://via.placeholder.com/40" // Placeholder for group member avatars
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
          <FaPlus className="text-gray-800 text-lg" />
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
          className="p-3 rounded-full bg-secondaryColour hover:bg-secondaryColour-light"
          onClick={handleSend}
        >
          <FaPaperPlane className="text-white text-lg" />
        </button>
      </div>
    </div>
  );
};

export default ChatScreen;
