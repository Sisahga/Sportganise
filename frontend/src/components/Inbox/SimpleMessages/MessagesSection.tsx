import MessagingDashboardChannelItem from "../DirectMessagesDashboard/MessagingDashboardChannelItem.tsx";
import { MessagesSectionProps } from "@/types/dmchannels.ts";
import { Dot } from "lucide-react";
import log from "loglevel";

function MessagesSection({ messageChannels }: MessagesSectionProps) {
  function formatDatetime(date: string | Date): string {
    const currentDate = new Date();
    const inputDate = new Date(date);
    log.info(`Formatting datetime: ${date}`);

    // Check if it's the same day
    const isSameDay = currentDate.toDateString() === inputDate.toDateString();

    // Check if it's less than 1 week ago
    const oneWeekAgo = new Date(currentDate);
    oneWeekAgo.setDate(currentDate.getDate() - 7);
    const isLessThanWeekAgo = inputDate >= oneWeekAgo;

    // Format the time without seconds if it's today
    if (isSameDay) {
      return inputDate.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    }

    // Format the day of the week if it's less than 1 week ago
    if (isLessThanWeekAgo) {
      return inputDate.toLocaleDateString([], { weekday: "short" });
    }

    // Otherwise, just return the date
    return inputDate.toLocaleDateString();
  }

  log.info(`Rendering MessagesSection with ${messageChannels.length} channels`);
  return (
    <div className="px-4">
      <div className="py-3 bg-white mt-4 rounded-lg shadow-lg">
        <div className="flex flex-col">
          <div>
            <h2 className="px-4 text-lg primary-colour font-bold">Messages</h2>
          </div>
          <div className="flex flex-col">
            {messageChannels.map((channel) => (
              <div className="flex items-center" key={channel.channelId}>
                <MessagingDashboardChannelItem
                  channel={channel}
                  layout="horizontal"
                  extraInfo={
                    <>
                      <span className="text-sm text-gray-400 font-regular">
                        {channel.lastEvent
                          ? formatDatetime(channel.lastEvent)
                          : ""}
                      </span>
                      {channel.read ? null : (
                        <div className="flex justify-end">
                          <Dot
                            className="secondary-colour"
                            strokeWidth={8}
                          ></Dot>
                        </div>
                      )}
                    </>
                  }
                />
                {/* Optional Delete Button (if onDeleteChannel is provided) */}
                {/*{onDeleteChannel && (*/}
                {/*  <button*/}
                {/*    onClick={() => onDeleteChannel(channel.channelId)}*/}
                {/*    className="text-sm text-red-500 px-2"*/}
                {/*  >*/}
                {/*    Delete*/}
                {/*  </button>*/}
                {/*)}*/}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MessagesSection;
