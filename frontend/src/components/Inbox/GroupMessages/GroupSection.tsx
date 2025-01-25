import MessagingDashboardChannelItem from "../DirectMessagesDashboard/MessagingDashboardChannelItem.tsx";
import { GroupSectionProps } from "@/types/dmchannels.ts";
import { Dot } from "lucide-react";
import log from "loglevel";

function GroupSection({ groupChannels }: GroupSectionProps) {
  log.info(`Rendering GroupSection with ${groupChannels.length} group channels`);
  return (
    <div className="mt-4 px-4">
      <div className="px-4 py-3 bg-white mt-4 rounded-lg shadow-lg">
        <div className="flex flex-col">
          <div>
            <h2 className="text-lg primary-colour font-bold">Groups</h2>
          </div>
          <div className="flex justify-start mt-4 gap-2 overflow-x-scroll">
            {groupChannels.map((channel) => (
              <MessagingDashboardChannelItem
                key={channel.channelId}
                channel={channel}
                layout="vertical"
                extraInfo={
                  !channel.read && (
                    <div
                      className="relative"
                      data-testid={`unread-dot-${channel.channelId}`}
                    >
                      <Dot
                        className="secondary-colour"
                        strokeWidth={12}
                        style={{
                          position: "absolute",
                          top: "-0.35rem",
                          left: "0.35rem",
                        }}
                      />
                    </div>
                  )
                }
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default GroupSection;
