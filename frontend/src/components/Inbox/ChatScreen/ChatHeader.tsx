// ChatHeader.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, MoreVertical, Trash, UserX } from "lucide-react";
import log from "loglevel";

interface ChatHeaderProps {
  chatName: string;
  chatAvatar: string;
  channelId: number;
  // If it's an individual or group, etc. (optional)
  chatType?: string;
  onDeleteChat?: (channelId: number) => void;
  onBlockUser?: () => void;
}

log.setLevel("info");

const ChatHeader: React.FC<ChatHeaderProps> = ({
  chatName,
  chatAvatar,
  channelId,
  onDeleteChat,
  onBlockUser,
}) => {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);

  // Toggle the 3-dot menu
  const handleOptionsClick = () => {
    setShowMenu((prev) => !prev);
  };

  const handleDeleteClick = () => {
    log.info(`Delete chat button clicked for channelId: ${channelId}`);
    if (onDeleteChat) {
      onDeleteChat(channelId);
      log.info(`Chat deleted for channelId: ${channelId}`);
    }
    setShowMenu(false);
  };

  const handleBlockClick = () => {
    log.info("Block user button clicked");
    if (onBlockUser) {
      onBlockUser();
      log.info("User blocked");
    }
    setShowMenu(false);
  };

  return (
    <header className="flex items-center justify-between px-4 py-3 bg-white shadow relative">
      {/* Back Button */}
      <button
        className="p-2 rounded-full bg-white hover:bg-gray-300"
        onClick={() =>
          {log.info("Back button clicked: navigating to previous page"); navigate(-1)}}
      >
        <ArrowLeft className="text-gray-800" size={24} />
      </button>

      {/* Chat Info */}
      <div className="flex items-center gap-3">
        <img
          src={chatAvatar}
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
            {/* Delete Chat */}
            {onDeleteChat && (
              <button
                className="flex items-center gap-2 w-full px-4 py-2 bg-white text-red-500 hover:bg-gray-100"
                onClick={handleDeleteClick}
              >
                Delete Chat
                <Trash size={16} />
              </button>
            )}
            {/* Block User */}
            {onBlockUser && (
              <button
                className="flex items-center gap-2 w-full px-4 py-2 bg-white text-red-500 hover:bg-gray-100"
                onClick={handleBlockClick}
              >
                Block User
                <UserX size={16} />
              </button>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default ChatHeader;
