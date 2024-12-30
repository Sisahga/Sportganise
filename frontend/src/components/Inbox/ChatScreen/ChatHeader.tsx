// ChatHeader.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, MoreVertical, Trash, UserX } from "lucide-react";

interface ChatHeaderProps {
  chatName: string;
  chatAvatar: string; // or potentially optional if you plan a fallback
  channelId: number;
  // If it's an individual or group, etc. (optional)
  chatType?: string;
  onDeleteChat?: (channelId: number) => void;
  onBlockUser?: () => void;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({
  chatName,
  chatAvatar,
  channelId,
  chatType,
  onDeleteChat,
  onBlockUser,
}) => {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);

  const handleOptionsClick = () => {
    setShowMenu((prev) => !prev);
  };

  const handleDeleteClick = () => {
    onDeleteChat?.(channelId);
    setShowMenu(false);
  };

  const handleBlockClick = () => {
    onBlockUser?.();
    setShowMenu(false);
  };

  // Example fallback if chatAvatar is sometimes empty
  const finalChatAvatar = chatAvatar || "https://img.icons8.com/ios-filled/150/000000/user-male-circle.png";

  return (
    <header className="flex items-center justify-between px-4 py-3 bg-white shadow relative">
      {/* Back Button */}
      <button
        className="p-2 rounded-full bg-white hover:bg-gray-300"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft className="text-gray-800" size={24} />
      </button>

      {/* Chat Info */}
      <div className="flex items-center gap-3">
        <img
          src={finalChatAvatar}
          alt={chatName}
          className="w-10 h-10 rounded-full object-cover"
        />
        <h1 className="text-lg font-bold text-gray-800">{chatName}</h1>
      </div>

      {/* Options (3-dot) */}
      <div className="relative">
        <button
          className="p-2 rounded-full bg-gray-200 hover:bg-gray-300"
          onClick={handleOptionsClick}
        >
          <MoreVertical className="text-gray-800" size={24} />
        </button>

        {/* Dropdown Menu */}
        {showMenu && (
  <div className="absolute right-0 mt-2 w-48 bg-white shadow-md rounded-md z-10">
    {onDeleteChat && (
      <button
        className="flex items-center gap-2 w-full px-4 py-2 
                   bg-white text-red-500 hover:bg-gray-100"
        onClick={handleDeleteClick}
      >
        <Trash size={16} />
        <span>Delete Chat</span>
      </button>
    )}
    {onBlockUser && (
      <button
        className="flex items-center gap-2 w-full px-4 py-2 
                   bg-white text-red-500 hover:bg-gray-100"
        onClick={handleBlockClick}
      >
        <UserX size={16} />
        <span>Block User</span>
      </button>
    )}
  </div>
)}
      </div>
    </header>
  );
};

export default ChatHeader;
