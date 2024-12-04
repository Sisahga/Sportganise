// MessagesSection.tsx
import { useNavigate } from "react-router-dom";

interface Message {
  channelId: number;
  channelType: string;
  channelName: string;
  channelImageBlob: string;
  lastMessage: string | null;
  read: boolean;
  lastEvent: string | null;
}

interface MessagesSectionProps {
  messages: Message[];
}

function MessagesSection({ messages }: MessagesSectionProps) {
  const navigate = useNavigate();

  return (
    <div className="mt-4 px-4 flex-1 overflow-y-auto">
      <h2 className="font-semibold text-lg text-gray-700 mb-4">Messages</h2>
      <div className="bg-white rounded-lg shadow divide-y divide-gray-200">
        {messages.map((message) => (
          <div
            key={message.channelId}
            className="flex items-center px-4 py-3 hover:bg-gray-50 cursor-pointer"
            onClick={() =>
              navigate("/chat", {
                state: {
                  chatName: message.channelName,
                  chatAvatar: message.channelImageBlob,
                  chatType: message.channelType.toLowerCase(), // 'simple' or 'group'
                  channelId: message.channelId,
                },
              })
            }
          >
            {/* User Profile Picture */}
            <img
              src={message.channelImageBlob}
              alt={message.channelName}
              className="w-12 h-12 rounded-full object-cover"
            />
            {/* Message Details */}
            <div className="ml-4 flex-1">
              <div className="flex justify-between">
                <h3 className="text-md font-bold text-gray-800">
                  {message.channelName}
                </h3>
                <span className="text-sm text-gray-400">
                  {message.lastEvent
                    ? new Date(message.lastEvent).toLocaleString()
                    : ""}
                </span>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                {message.lastMessage || "No messages yet"}
              </p>
            </div>
            {/* Unread Messages Indicator */}
            {!message.read && (
              <div className="ml-4 p-1 rounded-full bg-secondaryColour w-6 h-6 text-white text-center text-xs">
                {/* Indicator for unread messages */}
                ●
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default MessagesSection;
