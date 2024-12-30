// MessagesSection.tsx
import SectionWrapper from "../SectionWrapper";
import ChannelItem , {Channel} from "../ChannelItem";


interface ChannelMessage {
  channelId: number;
  channelType: string;
  channelName: string;
  channelImageBlob: string;
  lastMessage: string | null;
  read: boolean;
  lastEvent: string | null;
}

interface MessagesSectionProps {
  messages: ChannelMessage[];
  onDeleteChannel?: (channelId: number) => void; // <-- new prop
}

function MessagesSection({ messages, onDeleteChannel }: MessagesSectionProps) {
  // Convert ChannelMessage[] to Channel[] shape if needed
  const channels: Channel[] = messages.map((m) => ({
    channelId: m.channelId,
    channelType: m.channelType,
    channelName: m.channelName,
    channelImageBlob: m.channelImageBlob,
    lastMessage: m.lastMessage,
    lastEvent: m.lastEvent,
    read: m.read,
  }));

  return (
    <SectionWrapper title="Messages">
      <div className="divide-y divide-gray-200">
        {channels.map((channel) => (
          <div className="flex items-center" key={channel.channelId}>
            {/* Render the ChannelItem on the left */}
            <ChannelItem
              channel={channel}
              layout="horizontal"
              extraInfo={
                <>
                  <span className="text-sm text-gray-400">
                    {channel.lastEvent
                      ? new Date(channel.lastEvent).toLocaleString()
                      : ""}
                  </span>
                </>
              }
            />
            {/* Optional Delete Button (if onDeleteChannel is provided) */}
            {onDeleteChannel && (
              <button
                onClick={() => onDeleteChannel(channel.channelId)}
                className="text-sm text-red-500 px-2"
              >
                Delete
              </button>
            )}
          </div>
        ))}
      </div>
    </SectionWrapper>
  );
}

export default MessagesSection;
