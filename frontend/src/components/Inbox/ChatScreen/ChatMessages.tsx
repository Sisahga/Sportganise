import { ChatMessageProps } from "@/types/messaging.ts";
import defaultAvatar from "../../../assets/defaultAvatar.png";
import {
  differenceInDays,
  differenceInMinutes,
  format,
  isToday,
  parseISO,
} from "date-fns";
import { toZonedTime } from "date-fns-tz";
import log from "loglevel";
import ChatMessageAttachments from "@/components/Inbox/ChatScreen/ChatMessageAttachments.tsx";

log.setLevel("info");

const ChatMessages = ({
  messages,
  currentUserId,
  activateSkeleton,
  skeletonId,
  skeletonCount,
  status,
}: ChatMessageProps) => {
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
    <div className="flex flex-col justify-end overflow-y-scroll scroll-smooth px-4 pt-4 pb-2 w-full min-h-full">
      {messages.map((message, index) => {
        const showTimestamp =
          index === 0 || // Always show the timestamp for the first message
          differenceInMinutes(
            parseISO(message.sentAt),
            parseISO(messages[index - 1]?.sentAt),
          ) > 15;
        if (index === messages.length - 1 && message.type === "BLOCK") {
          const chatScreenInputArea = document.getElementById(
            "chatScreenInputArea",
          );
          if (chatScreenInputArea) {
            log.info("Chat input blocked due to BLOCK message");
            chatScreenInputArea.classList.add("pointer-events-none");
            chatScreenInputArea.classList.add("opacity-70");
          }
        }
        return (
          <div
            id={message.messageId.toString()}
            key={message.messageId}
            className="mb-4"
          >
            {/* Regular Chat Message */}
            {message.type == "CHAT" && (
              <>
                {/* Timestamp */}
                {showTimestamp && (
                  <div className="text-xs text-gray-500 text-center mb-2 mt-2">
                    {formatSentAt(message.sentAt)}
                  </div>
                )}

                <div
                  className={`flex items-end gap-2 ${message.senderId == currentUserId ? "justify-end" : ""}`}
                >
                  {/* Sender Avatar */}
                  {message.senderId !== currentUserId && (
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
                    className={`flex flex-col ${message.senderId === currentUserId ? "items-end" : "items-start"}`}
                    style={{ maxWidth: "80%" }}
                  >
                    {message.senderId !== currentUserId && (
                      <div className="px-3">
                        <p className="text-xs font-extralight rounded">
                          {message.senderFirstName}
                        </p>
                      </div>
                    )}
                    <div
                      id={`msg-status-${message.messageId}`}
                      className="flex flex-col gap-2 items-end max-w-full relative"
                    >
                      {activateSkeleton && skeletonId === message.messageId && (
                        <div className="overflow-x-auto w-full">
                          <div className="flex gap-2 min-w-min">
                            {Array.from({ length: skeletonCount }).map(
                              (_, index) => (
                                <div
                                  key={index}
                                  className="animate-skeleton rounded"
                                  style={{
                                    width: "7rem",
                                    height: "7rem",
                                  }}
                                ></div>
                              ),
                            )}
                          </div>
                        </div>
                      )}
                      {/* Grouped Attachments */}
                      {message.attachments.length > 0 && (
                        <ChatMessageAttachments
                          attachments={message.attachments}
                        />
                      )}

                      {/* Message Content */}
                      {message.messageContent !== "" && (
                        <div
                          className={`px-3 py-2 rounded-2xl shadow-lg w-fit  ${
                            message.senderId === currentUserId
                              ? "bg-secondaryColour-msg-gradient text-gray-800"
                              : "bg-gray-200 text-gray-800"
                          }`}
                        >
                          <p className="text-sm">{message.messageContent}</p>
                        </div>
                      )}

                      {index === messages.length - 1 &&
                        message.senderId === currentUserId && (
                          <p className="secondary-colour text-xs">
                            <b>{status}</b>
                          </p>
                        )}
                    </div>
                  </div>
                </div>
              </>
            )}
            {/* JOIN Message (Create message, or player/coach joins after initial creation) */}
            <div>
              {message.type == "JOIN" && (
                <div className="text-center faded-primary-colour font-light text-sm">
                  {message.senderId === currentUserId && index === 0 ? (
                    <p>{message.messageContent.split("*")[2]}</p>
                  ) : (
                    <p>{message.messageContent.split("*")[3]}</p>
                  )}
                </div>
              )}
            </div>
            {/* BLOCK, UNBLOCK, LEAVE, UPDATE, DELETE Messages */}
            <div>
              {(message.type == "BLOCK" ||
                message.type == "UNBLOCK" ||
                message.type == "LEAVE" ||
                message.type == "UPDATE" ||
                message.type == "DELETE") && (
                <div className="text-center faded-primary-colour font-light text-sm">
                  {message.senderId === currentUserId ? (
                    <p>{message.messageContent.split("*")[2]}</p>
                  ) : (
                    <p>{message.messageContent.split("*")[3]}</p>
                  )}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
export default ChatMessages;
