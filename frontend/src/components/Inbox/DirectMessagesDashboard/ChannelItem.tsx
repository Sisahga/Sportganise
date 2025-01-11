import React from "react";
import { useNavigate } from "react-router-dom";
import { ChannelItemProps } from "@/types/dmchannels.ts";

const ChannelItem: React.FC<ChannelItemProps> = ({
  channel,
  layout = "vertical",
  extraInfo,
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/pages/DirectMessageChannelPage", {
      state: {
        channelId: channel.channelId,
        channelName: channel.channelName,
        channelImageBlob: channel.channelImageBlob,
        channelType: channel.channelType,
        read: channel.read
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
        className={`flex items-center px-4 py-3 hover:bg-gray-50 cursor-pointer w-full 
        ${channel.read ? "" : "font-bold"}`}
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
        <div className="ml-4 flex justify-between flex-1 min-w-0">
          <div className="flex flex-col overflow-hidden">
            <p className="text-md font-semibold">{channel.channelName}</p>
            {channel.lastMessage && (
                <p className="text-sm text-gray-500 mt-1 truncate">{channel.lastMessage}</p>
            )}
          </div>
          <div className="flex flex-col min-w-fit">{extraInfo}</div>
        </div>
      </div>
    );
  }

  // Vertical layout (Groups)
  return (
    <button
      type="button"
      className={`flex flex-col items-center w-20 cursor-pointer focus:outline-none bg-white relative
      ${channel.read ? "" : "font-bold"}`}
      onClick={handleClick}
    >
      <img
        src={channel.channelImageBlob}
        alt={channel.channelName}
        className="w-12 h-12 rounded-full object-cover"
      />
      <span className="text-xs text-gray-600 mt-2 text-center inline-block
      max-w-full overflow-hidden overflow-ellipsis">
        {channel.channelName}
      </span>
      <div className="absolute top-0">{extraInfo}</div>
    </button>
  );
};

export default ChannelItem;
