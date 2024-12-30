// ChatMessages.tsx
import React from "react";
import defaultGroupAvatar from "../SampleImages/defaultGroupAvatar.png";

interface Message {
  id: number;
  sender: string;
  text: string;
  time: string;
  senderAvatar?: string;
}

interface ChatMessagesProps {
  messages: Message[];
  chatAvatar: string;
  chatType?: string;
}

const ChatMessages: React.FC<ChatMessagesProps> = ({
  messages,
  chatAvatar,
  chatType = "individual",
}) => {
  return (
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
            {/* Sender Avatar (only if not "You") */}
            {message.sender !== "You" && (
              <img
                src={
                  message.senderAvatar ||
                  (chatType === "group"
                    ? defaultGroupAvatar
                    : chatAvatar)
                }
                alt={message.sender}
                className="w-8 h-8 rounded-full object-cover"
              />
            )}
            {/* Bubble */}
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
  );
};

export default ChatMessages;
