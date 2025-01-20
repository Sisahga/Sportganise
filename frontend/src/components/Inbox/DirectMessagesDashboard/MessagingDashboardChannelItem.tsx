import React from "react";
import { useNavigate } from "react-router-dom";
import { ChannelItemProps } from "@/types/dmchannels.ts";
import useLastMessage from "@/hooks/useLastMessage.ts";

const MessagingDashboardChannelItem: React.FC<ChannelItemProps> = ({
  channel,
  layout = "vertical",
  extraInfo,
}) => {
  const navigate = useNavigate();
  const userId = 2; // TODO: Take cookie user id.

  const { lastMessage } = useLastMessage(channel.channelId);

  const handleClick = () => {
    console.log("Blocked status: ", lastMessage?.type);
    navigate("/pages/DirectMessageChannelPage", {
      state: {
        channelId: channel.channelId,
        channelName: channel.channelName,
        channelImageBlob: channel.channelImageBlob,
        channelType: channel.channelType,
        read: channel.read,
        isBlocked: lastMessage?.type === "BLOCK",
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
            {!channel.lastMessage?.startsWith("INIT*") &&
              !channel.lastMessage?.startsWith("BLOCK*") &&
              !channel.lastMessage?.startsWith("UNBLOCK*") && (
                <p className="text-sm text-gray-500 mt-1 truncate">
                  {channel.lastMessage}
                </p>
              )}
            {lastMessage?.type == "JOIN" && (
              <p className="text-sm text-gray-500 mt-1 truncate">
                {parseInt(lastMessage.messageContent.split("*")[1]) === userId
                  ? lastMessage.messageContent.split("*")[2]
                  : lastMessage.messageContent.split("*")[3]}
              </p>
            )}
            {channel.lastMessage?.split("*")[0].startsWith("BLOCK") && (
              <p className="text-sm text-gray-500 mt-1 truncate italic">
                {parseInt(channel.lastMessage.split("*")[1]) === userId
                  ? channel.lastMessage.split("*")[2]
                  : channel.lastMessage.split("*")[3]}
              </p>
            )}
            {channel.lastMessage?.split("*")[0].startsWith("UNBLOCK") && (
              <p className="text-sm text-gray-500 mt-1 truncate italic">
                {parseInt(channel.lastMessage.split("*")[1]) === userId
                  ? channel.lastMessage.split("*")[2]
                  : channel.lastMessage.split("*")[3]}
              </p>
            )}
            {channel.lastMessage?.startsWith("UPDATE*") && (
                <p className="text-sm text-gray-500 mt-1 truncate italic">
                  {parseInt(channel.lastMessage.split("*")[1]) === userId
                      ? channel.lastMessage.split("*")[2]
                      : channel.lastMessage.split("*")[3]}
                </p>
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
      <span
        className="text-xs text-gray-600 mt-2 text-center inline-block
      max-w-full overflow-hidden overflow-ellipsis"
      >
        {channel.channelName}
      </span>
      <div className="absolute top-0">{extraInfo}</div>
    </button>
  );
};

export default MessagingDashboardChannelItem;
