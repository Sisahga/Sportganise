import MessagingDashboardChannelItem from "../DirectMessagesDashboard/MessagingDashboardChannelItem.tsx";
import { MessagesSectionProps } from "@/types/dmchannels.ts";
import { Dot } from "lucide-react";
import log from "loglevel";
import { motion } from "framer-motion";

function MessagesSection({ messageChannels }: MessagesSectionProps) {
  function formatDatetime(date: string | Date): string {
    const currentDate = new Date();
    const inputDate = new Date(date);

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

  log.debug(
    `Rendering MessagesSection with ${messageChannels.length} channels`,
  );
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.25 }}
      viewport={{ once: true }}
    >
      <div className="px-4 relative max-w-screen-lg left-1/2 -translate-x-1/2">
        <div className="py-3 bg-white mt-4 rounded-lg shadow-lg border border-navbar mb-8">
          <div className="flex flex-col">
            <div>
              <h2 className="px-4 text-lg primary-colour font-bold">
                Messages
              </h2>
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
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default MessagesSection;
