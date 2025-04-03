import React from "react";
import { useNavigate } from "react-router";
import { ChannelItemProps } from "@/types/dmchannels.ts";
import useLastMessage from "@/hooks/useLastMessage.ts";
import log from "loglevel";
import DefaultGroupAvatar from "@/assets/defaultGroupAvatar.png";
import DefaultAvatar from "@/assets/defaultAvatar.png";
import useGetCookies from "@/hooks/useGetCookies.ts";
import { LoaderCircle } from "lucide-react";

const MessagingDashboardChannelItem: React.FC<ChannelItemProps> = ({
  channel,
  layout = "vertical",
  extraInfo,
}) => {
  const navigate = useNavigate();
  const { userId, preLoading } = useGetCookies();

  const { lastMessage } = useLastMessage(channel.channelId);

  const handleClick = () => {
    log.info("Blocked status: ", lastMessage?.type);
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

  const isSpecialMessage = (message: string | null) => {
    if (!message) return false;
    return (
      message.startsWith("INIT*") ||
      message.startsWith("BLOCK*") ||
      message.startsWith("UNBLOCK*") ||
      message.startsWith("DELETE*")
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleClick();
    }
  };

  if (preLoading) {
    return (
      <div>
        <LoaderCircle className="animate-spin h-6 w-6" />
      </div>
    );
  }

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
          src={channel.channelImageBlob || DefaultAvatar}
          alt={channel.channelName}
          onError={(e) => {
            e.currentTarget.src = DefaultAvatar;
          }}
          className="w-12 h-12 rounded-full object-cover"
        />

        {/* Channel Info */}
        <div className="ml-4 flex justify-between flex-1 min-w-0">
          <div className="flex flex-col overflow-hidden">
            <p className="text-md font-semibold">{channel.channelName}</p>
            {!isSpecialMessage(channel.lastMessage) && (
              <p className="text-sm text-gray-500 mt-1 truncate">
                {channel.lastMessage === "" && lastMessage?.hasAttachments
                  ? `${channel.channelName} sent an attachment`
                  : channel.lastMessage}
              </p>
            )}
            {lastMessage?.type == "JOIN" && (
              <p className="text-sm text-gray-500 mt-1 truncate">
                {parseInt(lastMessage.messageContent.split("*")[1]) === userId
                  ? lastMessage.messageContent.split("*")[2]
                  : lastMessage.messageContent.split("*")[3]}
              </p>
            )}
            {channel.lastMessage?.split("*")[0].startsWith("BLOCK") ||
              channel.lastMessage?.split("*")[0].startsWith("UNBLOCK") ||
              (channel.lastMessage?.split("*")[0].startsWith("DELETE*") && (
                <p className="text-sm text-gray-500 mt-1 truncate italic">
                  {parseInt(channel.lastMessage.split("*")[1]) === userId
                    ? channel.lastMessage.split("*")[2]
                    : channel.lastMessage.split("*")[3]}
                </p>
              ))}
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
      className={`flex flex-col items-center p-1.5 w-20 cursor-pointer focus:outline-none bg-white relative
      ${channel.read ? "" : "font-bold"} hover:bg-gray-50`}
      onClick={handleClick}
    >
      <img
        src={channel.channelImageBlob || DefaultGroupAvatar}
        alt={channel.channelName}
        onError={(e) => {
          e.currentTarget.src = DefaultGroupAvatar;
        }}
        className="w-12 h-12 rounded-full object-cover"
      />
      <span
        className="text-xs text-gray-600 mt-2 text-center inline-block text-nowrap
      max-w-full overflow-hidden overflow-ellipsis"
      >
        {channel.channelName}
      </span>
      <div className="absolute top-0">{extraInfo}</div>
    </button>
  );
};

export default MessagingDashboardChannelItem;
