// ChatMessages.tsx
import React from "react";

// 1) Define the structure of each message
export interface Message {
  id: number;
  sender: string;
  text: string;
  time: string;
  senderAvatar?: string;
}

// 2) Define the props that ChatMessages expects
interface ChatMessagesProps {
  messages: Message[];
  chatAvatar: string;
  chatType?: string; // "individual" | "group" etc.
}

// 3) Define the component with React.FC<ChatMessagesProps>
const ChatMessages: React.FC<ChatMessagesProps> = ({
  messages,
  chatAvatar,
  chatType = "individual",
}) => {
  return (
    <div className="flex-1 overflow-y-auto px-4 py-3">
      {/* Render messages */}
      {messages.map((message) => (
        <div key={message.id} className="mb-4">
          {/* Example layout code */}
          <div className="text-xs text-gray-500 text-center mb-2">
            {message.time}
          </div>

          <div
            className={`flex ${
              message.sender === "You" ? "justify-end" : "justify-start"
            } items-center gap-3`}
          >
            {message.sender !== "You" && (
              <img
                src={message.senderAvatar || chatAvatar}
                alt={message.sender}
                className="w-8 h-8 rounded-full object-cover"
              />
            )}
            <div
              className={`px-4 py-2 rounded-lg ${
                message.sender === "You"
                  ? "bg-secondaryColour text-white"
                  : "bg-gray-200 text-gray-800"
              }`}
            >
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

// 4) Export the component as default
export default ChatMessages;
