// GroupSection.tsx
import SectionWrapper from "./SectionWrapper";
import ChannelItem, { Channel } from "./ChannelItem";

interface Group {
  channelId: number;
  channelName: string;
  channelImageBlob: string;
}

interface GroupSectionProps {
  groups: Group[];
}

function GroupSection({ groups }: GroupSectionProps) {
  // Convert Group[] to Channel[] if needed
  const channels: Channel[] = groups.map((g) => ({
    channelId: g.channelId,
    channelName: g.channelName,
    channelImageBlob: g.channelImageBlob,
    channelType: "group",
  }));

  return (
    <SectionWrapper title="Groups">
      <div className="flex gap-4 overflow-x-auto">
        {channels.map((channel) => (
          <ChannelItem
            key={channel.channelId}
            channel={channel}
            layout="vertical" 
          />
        ))}
      </div>
    </SectionWrapper>
  );
}

export default GroupSection;
