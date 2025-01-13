import { ChatMessageProps } from "@/types/messaging.ts";
import defaultAvatar from "../../../assets/defaultAvatar.png";
import {
  format,
  isToday,
  parseISO,
  differenceInMinutes,
  differenceInDays,
} from "date-fns";
import { toZonedTime } from "date-fns-tz";

const ChatMessages = ({ messages }: ChatMessageProps) => {
  const userId = 2; // TODO: Take cookie user id.

  const formatSentAt = (
    sentAt: string,
    timeZone: string = "America/New_York",
  ) => {
    const date = parseISO(sentAt);
    const zonedDate = toZonedTime(date, timeZone);

    if (isToday(zonedDate)) {
      return format(zonedDate, "h:mm a"); // Just show the time
    }

    if (differenceInDays(new Date(), zonedDate) < 7) {
      return `${format(zonedDate, "eee").toUpperCase()} ${format(zonedDate, "h:mm a")}`; // Format: SAT 12:00 PM
    }
    return format(zonedDate, "MM/dd/yyyy 'at' h:mm a");
  };

  return (
    <div className="flex flex-col justify-end flex-1 overflow-y-scroll px-4 py-4">
      {messages.map((message, index) => {
        const showTimestamp =
          index === 0 || // Always show the timestamp for the first message
          differenceInMinutes(
            parseISO(message.sentAt),
            parseISO(messages[index - 1]?.sentAt),
          ) > 15;
        return (
          <div key={message.messageId} className="mb-4">
            {/* Timestamp */}
            {showTimestamp && (
              <div className="text-xs text-gray-500 text-center mb-2">
                {formatSentAt(message.sentAt)}
              </div>
            )}

            <div
              className={`flex items-end gap-2 ${message.senderId == userId ? "justify-end" : ""}`}
            >
              {/* Sender Avatar */}
              {message.senderId !== userId && (
                <div className="flex items-end">
                  <img
                    src={message.avatarUrl}
                    alt={defaultAvatar}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                </div>
              )}
              {/* Message Bubble */}
              <div
                className={`flex flex-col ${message.senderId === userId ? "items-end" : "items-start"}`}
                style={{ maxWidth: "80%" }}
              >
                {message.senderId !== userId && (
                  <div className="px-3">
                    <p className="text-xs font-extralight">
                      {message.senderFirstName}
                    </p>
                  </div>
                )}
                {/* Message Content */}
                <div
                  className={`px-3 py-2 rounded-2xl ${
                    message.senderId === userId
                      ? "bg-secondaryColour text-gray-800"
                      : "bg-gray-200 text-gray-800"
                  }`}
                >
                  <p className="text-sm">{message.messageContent}</p>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
export default ChatMessages;
