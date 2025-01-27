import type React from "react";
import { useState, useRef, useEffect, type DragEvent } from "react";
import { useLocation } from "react-router";
import { Send, FolderOpen, Paperclip } from "lucide-react";
import useChatMessages from "../../../hooks/useChatMessages";
import defaultAvatar from "../../../assets/defaultAvatar.png";
import defaultGroupAvatar from "../../../assets/defaultGroupAvatar.png";
import "./ChatScreen.css";
import WebSocketService from "@/services/WebSocketService";
import type { MessageComponent, SendMessageComponent } from "@/types/messaging";
import ChatMessages from "@/components/Inbox/ChatScreen/ChatMessages";
import { Button } from "@/components/ui/Button";
import ChannelSettingsDropdown from "./Settings/ChannelSettingsDropdown";
import useSendMessage from "@/hooks/useSendMessage";
import UserBlockedComponent from "@/components/Inbox/ChatScreen/Settings/UserBlockedComponent";
import log from "loglevel";
import { getAccountIdCookie, getCookies } from "@/services/cookiesService";
import BackButton from "@/components/ui/back-button";
import {
  FileInput,
  FileUploader,
  FileUploaderContent,
  FileUploaderItem,
} from "@/components/ui/file-upload";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const formSchema = z.object({
  message: z.string().optional(),
  attachments: z.array(z.custom<File>()).optional(),
});

type FormData = z.infer<typeof formSchema>;

export interface ChatScreenProps {
  channelId: number;
  channelName: string;
  channelImageBlob: string;
  read: boolean;
  channelType: string;
  isBlocked: boolean;
}

export interface FileAttachment {
  fileName: string;
  fileSize: number;
  fileType: string;
  fileUrl: string;
}

export interface SendMessagePayload extends MessageComponent {
  attachments: FileAttachment[];
}

const ChatScreen: React.FC = () => {
  const location = useLocation();

  const { state } = location;
  const {
    channelId,
    channelName,
    channelImageBlob,
    read,
    channelType,
    isBlocked,
  } = state as ChatScreenProps;

  const cookies = getCookies();
  const currentUserId = getAccountIdCookie(cookies);

  const [connected, setConnected] = useState<boolean>(false);
  const webSocketServiceRef = useRef<WebSocketService | null>(null);
  const [channelIsBlocked, setChannelIsBlocked] = useState<boolean>(isBlocked);
  const [currentChannelName, setCurrentChannelName] =
    useState<string>(channelName);
  const [currentChannelImageUrl, setCurrentChannelImageUrl] = useState<string>(
    channelImageBlob || defaultAvatar,
  );
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const { messages, setMessages, loading, error } = useChatMessages(
    channelId,
    read,
  );
  const { sendDirectMessage } = useSendMessage();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: "",
      attachments: [],
    },
  });

  const connectWebSocket = async (): Promise<void> => {
    webSocketServiceRef.current = new WebSocketService(onMessageReceived);
    const connSuccess = await webSocketServiceRef.current.connect();
    setConnected(connSuccess);
  };

  const onMessageReceived = (message: MessageComponent): void => {
    setMessages((prevMessages) => [...prevMessages, message]);
    if (message.type === "BLOCK") {
      setChannelIsBlocked(true);
    } else if (message.type === "UNBLOCK") {
      setChannelIsBlocked(false);
    }
  };

  const handleDragEnter = (e: DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const files = Array.from(e.dataTransfer.files);
      form.setValue("attachments", files);
    }
  };

  const onSubmit = (data: FormData) => {
    if (
      data.message?.trim() === "" &&
      (!data.attachments || data.attachments.length === 0)
    )
      return;

    const fileAttachments: FileAttachment[] =
      data.attachments?.map((file) => ({
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
        fileUrl: URL.createObjectURL(file),
      })) || [];

    const messagePayload: SendMessageComponent = {
      senderId: currentUserId,
      channelId: channelId,
      messageContent: data.message || "",
      attachments: fileAttachments,
      sentAt: new Date().toISOString(),
      type: "CHAT",
      senderFirstName: "Walter", // TODO: Replace with actual first name from cookies
      avatarUrl:
        "https://sportganise-bucket.s3.us-east-2.amazonaws.com/walter_white_avatar.jpg",
    };

    sendDirectMessage(messagePayload, webSocketServiceRef.current);
    form.reset();
  };

  useEffect(() => {
    if (!connected) {
      connectWebSocket().then(() => {
        if (!connected) {
          document
            .getElementById("wsResponseFailAlertCtn")
            ?.classList.remove("hidden");
        }
      });
    }
  }, [connected, connectWebSocket]); // Added connectWebSocket to dependencies

  useEffect(() => {
    log.debug("Messages fetched:", messages);
  }, [messages]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div
      id="chatScreenMainCtn"
      className={`flex flex-col ${isDragging ? "bg-blue-100" : ""}`}
      style={{height: "calc(100vh - 7rem)"}}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {/* Header */}
      <header className="flex items-center justify-between p-4 bg-white shadow gap-4">
        <div className="flex flex-grow items-center gap-4">
          <BackButton />
          <div className="flex items-center flex-grow gap-3">
            <img
              src={currentChannelImageUrl || "/placeholder.svg"}
              alt={defaultGroupAvatar}
              style={{ width: "36px", height: "36px" }}
              className="rounded-full object-cover"
            />
            <h1 className="text-lg font-bold text-gray-800 te">
              {currentChannelName}
            </h1>
          </div>
          <ChannelSettingsDropdown
            channelType={channelType}
            channelId={channelId}
            webSocketRef={webSocketServiceRef.current}
            isBlocked={channelIsBlocked}
            currentUserId={currentUserId}
            channelName={channelName}
            setCurrentChannelName={setCurrentChannelName}
            currentChannelPictureUrl={currentChannelImageUrl}
            setCurrentChannelPictureUrl={setCurrentChannelImageUrl}
          />
        </div>
      </header>

      {/* Display when failing to connect to web socket. */}
      <div id="wsResponseFailAlertCtn" className="hidden w-full">
        <div
          id="wsResponseFailAlert"
          className="hidden p-4 w-full text-white bg-red-500"
        >
          <p>Web socket connection failed.</p>
        </div>
      </div>

      {/* Chat Messages */}
      <ChatMessages messages={messages} currentUserId={currentUserId} />

      {/* Show blocked component if channel is blocked */}
      <UserBlockedComponent
        showBlockedMessage={channelIsBlocked}
        channelIsBlocked={channelIsBlocked}
        webSocketRef={webSocketServiceRef.current}
        channelId={channelId}
        channelType={channelType}
      />

      {/* Message Input Area */}
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={`${channelIsBlocked ? "force-hide" : ""} flex items-end gap-3 px-4 py-3 bg-white shadow`}
      >
        <Controller
          name="attachments"
          control={form.control}
          render={({ field }) => (
            <FileUploader
              className="w-auto"
              value={field.value || []}
              onValueChange={field.onChange}
              dropzoneOptions={{
                maxFiles: 5,
                maxSize: 1024 * 1024 * 10, // 10MB
                multiple: true,
              }}
            >
              <FileInput className="rounded-full bg-white w-10 h-10 flex items-center justify-center">
                <FolderOpen
                  className="text-gray-800 folder-size"
                  size={24}
                  strokeWidth={1.5}
                />
              </FileInput>
              <FileUploaderContent className="flex-row absolute bottom-[50px] left-0 overflow-auto w-[100vw]">
                {field.value &&
                  field.value.length > 0 &&
                  field.value.map((file, index) => (
                    <FileUploaderItem key={index} index={index} className="">
                      <Paperclip className="h-4 w-4 stroke-current" />
                      <span>{file.name}</span>
                    </FileUploaderItem>
                  ))}
              </FileUploaderContent>
            </FileUploader>
          )}
        />

        <Controller
          name="message"
          control={form.control}
          render={({ field }) => (
            <textarea
              {...field}
              id="chatScreenInputArea"
              placeholder="Send a message..."
              className={`${channelIsBlocked ? "force-hide" : ""} flex-1 px-4 py-2 border bg-white rounded-xl text-sm focus:outline-none resize-none`}
              style={{ scrollbarWidth: "none" }}
              rows={1}
            />
          )}
        />

        <Button
          type="submit"
          variant="ghost"
          aria-label="Send"
          className="rounded-full bg-white w-10 h-10 flex items-center justify-center"
          style={{ transform: "rotate(45deg)" }}
          disabled={
            form.watch("message")?.trim() === "" &&
            (!form.watch("attachments") ||
              form.watch("attachments")?.length === 0)
          }
        >
          <Send
            className={`folder-size ${
              form.watch("message")?.trim() === "" &&
              (!form.watch("attachments") ||
                form.watch("attachments")?.length === 0)
                ? "faded-primary-colour"
                : "secondary-colour"
            }`}
            size={20}
            strokeWidth={2}
            style={{ position: "relative", left: "-1.5px", top: "1.5px" }}
          />
        </Button>
      </form>
    </div>
  );
};

export default ChatScreen;
