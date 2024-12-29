// MessagesSection.tsx
import SectionWrapper from "./SectionWrapper";
import ChannelItem , {Channel} from "./ChannelItem";


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
          <ChannelItem
            key={channel.channelId}
            channel={channel}
            layout="horizontal" // display them in a horizontal row with extra info
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
        ))}
      </div>
    </SectionWrapper>
  );
}

export default MessagesSection;
