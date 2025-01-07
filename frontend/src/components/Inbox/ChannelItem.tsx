// ChannelItem.tsx
import React from "react";
import { useNavigate } from "react-router-dom";

export interface Channel {
  channelId: number;
  channelName: string;
  channelImageBlob: string;
  channelType: string;
  lastMessage?: string | null;
  lastEvent?: string | null;
  read?: boolean;
}

interface ChannelItemProps {
  channel: Channel;
  layout?: "horizontal" | "vertical";
  extraInfo?: React.ReactNode; // often used for displaying time, etc.
}

const ChannelItem: React.FC<ChannelItemProps> = ({
  channel,
  layout = "vertical",
  extraInfo,
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/pages/DirectMessageChannelPage", {
      state: {
        chatName: channel.channelName,
        chatAvatar: channel.channelImageBlob,
        chatType: channel.channelType,
        channelId: channel.channelId,
      },
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleClick();
    }
  };

  // Horizontal layout (Messages)
  if (layout === "horizontal") {
    return (
      <div
        tabIndex={0}
        role="button"
        className="flex items-center px-4 py-3 hover:bg-gray-50 cursor-pointer w-full"
        onClick={handleClick}
        onKeyDown={handleKeyDown}
      >
        {/* Channel Avatar */}
        <img
          src={channel.channelImageBlob}
          alt={channel.channelName}
          className="w-12 h-12 rounded-full object-cover"
        />

        {/* Channel Info */}
        <div className="ml-4 flex-1">
          {/* Row: name on the left, time (extraInfo) on the right */}
          <div className="flex justify-between items-center">
            <h3 className="text-md font-bold text-gray-800">
              {channel.channelName}
            </h3>
            <div className="ml-4">{extraInfo}</div>
            {/* The "ml-4" adds some spacing between the name and time. */}
          </div>

          {/* Last message (optional) */}
          {channel.lastMessage && (
            <p className="text-sm text-gray-500 mt-1">{channel.lastMessage}</p>
          )}
        </div>
      </div>
    );
  }

  // Vertical layout (Groups)
  return (
    <button
      type="button"
      className="flex flex-col items-center w-20 cursor-pointer 
               focus:outline-none bg-white" // add bg-white here
      onClick={handleClick}
    >
      <img
        src={channel.channelImageBlob}
        alt={channel.channelName}
        className="w-16 h-16 rounded-full object-cover"
      />
      <span className="text-sm text-gray-600 mt-2 text-center">
        {channel.channelName}
      </span>
    </button>
  );
};

export default ChannelItem;
