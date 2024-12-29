// ChannelItem.tsx
import React from "react";
import { useNavigate } from "react-router-dom";

// 1. Export the interface if you're using it in other files
export interface Channel {
  channelId: number;
  channelName: string;
  channelImageBlob: string;
  channelType: string;
  lastMessage?: string | null;
  read?: boolean;
  lastEvent?: string | null;
}

interface ChannelItemProps {
  channel: Channel;
  layout?: "horizontal" | "vertical";
  extraInfo?: React.ReactNode;
}

const ChannelItem: React.FC<ChannelItemProps> = ({
  channel,
  layout = "vertical",
  extraInfo,
}) => {
  const navigate = useNavigate();

  const handleNavigation = () => {
    navigate("/chat", {
      state: {
        chatName: channel.channelName,
        chatAvatar: channel.channelImageBlob,
        chatType: channel.channelType,
        channelId: channel.channelId,
      },
    });
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleNavigation();
    }
  };

  if (layout === "vertical") {
    // "Group" style layout
    return (
      <button
        type="button"
        className="flex flex-col items-center w-20 cursor-pointer focus:outline-none"
        onClick={handleNavigation}
      >
        <img
          src={channel.channelImageBlob}
          alt={channel.channelName}
          className="w-12 h-12 rounded-full object-cover"
        />
        <span className="text-sm text-gray-600 mt-2 text-center">
          {channel.channelName}
        </span>
      </button>
    );
  }
  

  // "Messages" style layout
  return (
    <div
      tabIndex={0}
      role="button"
      className="flex items-center px-4 py-3 hover:bg-gray-50 cursor-pointer"
      onClick={handleNavigation}
      onKeyDown={handleKeyDown}
    >
      <img
        src={channel.channelImageBlob}
        alt={channel.channelName}
        className="w-12 h-12 rounded-full object-cover"
      />
      <div className="ml-4 flex-1">
        <div className="flex justify-between">
          <h3 className="text-md font-bold text-gray-800">
            {channel.channelName}
          </h3>
          {extraInfo}
        </div>
      </div>
    </div>
  );
};

export default ChannelItem;
