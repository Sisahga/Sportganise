// ChatInput.tsx
import React, { useState } from "react";
import { Plus, Send } from "lucide-react";

interface ChatInputProps {
  onSend: (messageText: string) => void;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSend }) => {
  const [newMessage, setNewMessage] = useState("");

  const handleSendClick = () => {
    if (newMessage.trim() === "") return;
    onSend(newMessage);
    setNewMessage("");
  };

  return (
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
        onClick={handleSendClick}
        disabled={newMessage.trim() === ""}
      >
        <Send className="text-white" size={24} />
      </button>
    </div>
  );
};

export default ChatInput;
