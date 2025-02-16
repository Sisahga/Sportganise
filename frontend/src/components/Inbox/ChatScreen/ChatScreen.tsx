import React, {type DragEvent, useEffect, useRef, useState} from "react";
import {useLocation, useNavigate} from "react-router";
import {ChevronLeft, FolderOpen, Paperclip, Send, X} from "lucide-react";
import useChatMessages from "../../../hooks/useChatMessages";
import defaultAvatar from "../../../assets/defaultAvatar.png";
import defaultGroupAvatar from "../../../assets/defaultGroupAvatar.png";
import "./ChatScreen.css";
import WebSocketService from "@/services/WebSocketService";
import type {MessageComponent, SendMessageComponent} from "@/types/messaging";
import ChatMessages from "@/components/Inbox/ChatScreen/ChatMessages";
import {Button} from "@/components/ui/Button";
import ChannelSettingsDropdown from "./Settings/ChannelSettingsDropdown";
import useSendMessage from "@/hooks/useSendMessage";
import UserBlockedComponent from "@/components/Inbox/ChatScreen/Settings/UserBlockedComponent";
import log from "loglevel";
import {getAccountIdCookie, getCookies} from "@/services/cookiesService";

import {Controller, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import * as z from "zod";
import {ChatScreenProps} from "@/types/dmchannels.ts";
import useGetDeleteChannelRequest from "@/hooks/useGetDeleteChannelRequest.ts";
import {DeleteRequest} from "@/components/Inbox/ChatScreen/DeleteRequest";
import {toast} from "@/hooks/use-toast.ts";
import {
  MAX_GROUP_FILE_SIZE,
  MAX_SINGLE_FILE_SIZE,
  MAX_SINGLE_FILE_SIZE_TEXT,
} from "@/constants/file.constants.ts";
import useUploadAttachments from "@/hooks/useUploadAttachments.ts";
import ResponseDto from "@/types/response.ts";

const formSchema = z.object({
  message: z.string().optional(),
  attachments: z.array(z.custom<File>()).optional(),

});

type FormData = z.infer<typeof formSchema>;

const ChatScreen: React.FC = () => {
  const location = useLocation();

  const {state} = location;
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

  const navigate = useNavigate();

  // States
  const [connected, setConnected] = useState<boolean>(false);
  const webSocketServiceRef = useRef<WebSocketService | null>(null);
  const [channelIsBlocked, setChannelIsBlocked] = useState<boolean>(isBlocked);
  const [currentChannelName, setCurrentChannelName] =
      useState<string>(channelName);
  const [currentChannelImageUrl, setCurrentChannelImageUrl] = useState<string>(
      channelImageBlob || defaultAvatar,
  );
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [attachments, setAttachments] = useState<File[]>([]);
  const [activateSkeleton, setActivateSkeleton] = useState<boolean>(false);
  const [skeletonId, setSkeletonId] = useState<number>(0);
  const [skeletonCount, setSkeletonCount] = useState<number>(0);
  const [messageStatus, setMessageStatus] = useState<string>("Delivered");

  // Hooks.
  const {messages, setMessages, loading, error} = useChatMessages(
      channelId,
      read,
  ); // Fetch messages.
  const {sendDirectMessage} = useSendMessage();
  const {uploadAttachments} = useUploadAttachments();
  const {
    deleteRequestActive,
    deleteRequest,
    setDeleteRequestActive,
    setDeleteRequest,
    currentMemberStatus,
  } = useGetDeleteChannelRequest(channelId, currentUserId); // Check if a delete request is active.

  const chatScrollRef = useRef<HTMLDivElement>(null);

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
    } else if (message.type === "DELETE") {
      setDeleteRequestActive(true);
    }
    if (message.attachments.length !== 0) {
      const dupMessage = document.getElementById(message.messageId.toString());
      if (dupMessage) {
        log.info("Removing duplicate message container...");
        dupMessage.remove();
      }
    }
    if (message.senderId !== currentUserId) {
      setMessageStatus("");
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

  const adjustTextAreaHeight = (element: HTMLTextAreaElement) => {
    if (!element) return;
    element.style.height = "auto";
    element.style.height = `${element.scrollHeight}px`;
  };

  const resetTextAreaHeight = (element: HTMLTextAreaElement) => {
    if (!element) return;
    element.style.height = "auto";
  };

  const handleAddAttachment = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      console.log(e.target.files);
      const files = Array.from(e.target.files);
      if (attachments.length + files.length > 5) {
        toast({
          title: "Error",
          description: "You can only upload a maximum of 5 files at a time.",
          variant: "destructive",
        });
        e.target.value = "";
        return;
      }
      // Check if any file size exceeds 10MB.
      if (files.some((file) => file.size > MAX_SINGLE_FILE_SIZE)) {
        toast({
          title: "Error",
          description: `File size should not exceed ${MAX_SINGLE_FILE_SIZE_TEXT}.`,
          variant: "destructive",
        });
        e.target.value = "";
        return;
      }
      // Check if total file size exceeds 25MB.
      let totalSize = 0;
      for (const file of files) {
        totalSize += file.size;
        if (totalSize > MAX_GROUP_FILE_SIZE) {
          toast({
            title: "Error",
            description: `Total file size should not exceed ${MAX_SINGLE_FILE_SIZE_TEXT}.`,
            variant: "destructive",
          });
          e.target.value = "";
          return;
        }
      }
      setAttachments(prev => {
        const newAttachments = [...prev, ...files];
        form.setValue("attachments", newAttachments);
        return newAttachments;
      });
      e.target.value = "";
    }
  };

  const handleRemoveAttachment = (index: number) => {
    setAttachments((prev) => {
      const updatedAttachments = prev.filter((_, i) => i !== index);
      form.setValue("attachments", updatedAttachments);
      return updatedAttachments;
    });
  };

  const onSubmit = async (data: FormData) => {
    if (
        data.message?.trim() === "" &&
        (!data.attachments || data.attachments.length === 0)
    )
      return;

    const messagePayload: SendMessageComponent = {
      senderId: currentUserId,
      channelId: channelId,
      messageContent: data.message || "",
      sentAt: new Date().toISOString(),
      type: "CHAT",
      senderFirstName: cookies.firstName,
      avatarUrl: cookies.pictureUrl,
    };
    setMessageStatus("Sending...");
    const response = await sendDirectMessage(messagePayload, webSocketServiceRef.current);
    if (!response) {
      setMessageStatus("");
    }

    form.setValue("message", ""); // Clear message input.
    setAttachments([]); // Clear attachments so they get out of view.

    // Send attachments if any.
    if (data.attachments && data.attachments.length > 0 && response) {
      setActivateSkeleton(true);
      setSkeletonId(response.messageId);
      setSkeletonCount(data.attachments.length);

      log.info("Uploading {} attachments", data.attachments.length);
      const formData = new FormData();
      data.attachments.forEach((file) => {
        formData.append("attachments", file);
      });
      formData.append("messageId", response.messageId.toString());
      formData.append("senderId", currentUserId.toString());
      formData.append("senderFirstName", cookies.firstName);
      formData.append("senderAvatarUrl", cookies.pictureUrl || "");
      const uploadResponse: ResponseDto<MessageComponent> = await uploadAttachments(formData);
      if (uploadResponse.statusCode === 200) {
        log.info("Attachments uploaded successfully.");
      } else {
        log.error("Error uploading attachments:", uploadResponse.message);
        toast({
          title: "Error",
          description: "Error uploading attachments. Try reuploading them.",
          variant: "destructive",
        });
        setMessageStatus("");
      }
      setActivateSkeleton(false);
      setSkeletonId(0);
      setSkeletonCount(0)
    }

    setMessageStatus("Delivered");

    form.reset();
    resetTextAreaHeight(
        document.getElementById("chatScreenInputArea") as HTMLTextAreaElement,
    );
  };

  const scrollChatScreenToBottom = () => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }

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
  }, []); // TODO: Add proper dependencies.

  useEffect(() => {
    log.debug("Messages fetched:", messages);
    scrollChatScreenToBottom();
  }, [messages]);

  useEffect(() => {
    scrollChatScreenToBottom();
  }, [attachments]);

  useEffect(() => {
    if (deleteRequestActive && deleteRequest) {
      log.info("Delete request active:", deleteRequest);
      log.info("Current member status:", currentMemberStatus);
    }
  }, [deleteRequestActive]);

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
          className={`flex flex-col
      ${isDragging ? "bg-blue-100" : ""}`}
          style={{height: "calc(100vh - 7rem)"}}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
      >
        {/* Header */}
        <header
            className="flex items-center justify-between p-4 bg-white shadow gap-4 flex-shrink-0"
            style={{borderRadius: "0 0 1rem 1rem"}}
        >
          <div className="flex flex-grow items-center gap-4">
            <Button
                className="rounded-xl font-semibold"
                variant="outline"
                onClick={() => {
                  navigate("/pages/DirectMessagesDashboard");
                }}
                aria-label="back"
            >
              <ChevronLeft/>
              <p className="sm:block hidden">Back</p>
            </Button>
            <div className="flex items-center flex-grow gap-3">
              <img
                  src={currentChannelImageUrl || "/placeholder.svg"}
                  alt={defaultGroupAvatar}
                  style={{width: "36px", height: "36px"}}
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
                isDeleteRequestActive={deleteRequestActive}
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

        {/* Don't display to non-admin group members */}
        {deleteRequestActive && currentMemberStatus !== undefined && (
            <DeleteRequest
                deleteRequestActive={deleteRequestActive}
                deleteRequest={deleteRequest}
                currentUserId={currentUserId}
                currentUserApproverStatus={currentMemberStatus}
                setDeleteRequestActive={setDeleteRequestActive}
                websocketRef={webSocketServiceRef.current}
                setDeleteRequest={setDeleteRequest}
            />
        )}

        {/* Chat Messages */}
        <div ref={chatScrollRef} className="overflow-y-auto flex-1 mt-4 relative">
          <ChatMessages
              messages={messages}
              currentUserId={currentUserId}
              activateSkeleton={activateSkeleton}
              skeletonId={skeletonId}
              skeletonCount={skeletonCount}
              status={messageStatus}
          />
        </div>

        {/* Show blocked component if channel is blocked */}
        <UserBlockedComponent
            showBlockedMessage={channelIsBlocked}
            channelIsBlocked={channelIsBlocked}
            webSocketRef={webSocketServiceRef.current}
            channelId={channelId}
            channelType={channelType}
        />

        {attachments.length > 0 && (
            <div className="flex flex-col">
              {/* Image Attachments Row */}
              {attachments.some(file => file.type.startsWith("image/")) && (
                  <div className="flex overflow-x-scroll gap-1 mb-1 px-2">
                    {attachments
                        .filter(file => file.type.startsWith("image/"))
                        .map((file, index) => (
                            <div
                                key={`img-${index}`}
                                className="flex gap-2 items-center justify-center px-2 py-1 rounded-lg text-sm relative shadow-lg bg-gradient-to-br from-white to-secondaryColour/40"
                            >
                              <X
                                  className="h-4 w-4 stroke-current absolute top-0 right-0 mt-1 mr-1"
                                  onClick={() => handleRemoveAttachment(attachments.indexOf(file))}
                              />
                              <div className="flex flex-col items-center pt-3.5 pb-1 max-w-20">
                                <img
                                    src={URL.createObjectURL(file)}
                                    alt={file.name}
                                    className="h-16 w-16 object-cover rounded-sm"
                                />
                                <span className="truncate w-20 text-center" title={file.name}>{file.name}</span>
                              </div>
                            </div>
                        ))}
                  </div>
              )}
              {/* Non-Image Attachments Row */}
              {attachments.some(file => !file.type.startsWith("image/")) && (
                  <div className="flex overflow-x-scroll gap-1 mb-2 px-2">
                    {attachments
                        .filter(file => !file.type.startsWith("image/"))
                        .map((file, index) => (
                            <div
                                key={`file-${index}`}
                                className={`flex gap-2 items-center justify-center px-2 py-1 rounded-lg text-sm relative shadow bg-gradient-to-br from-white to-secondaryColour/20`}
                            >
                              <Paperclip className="h-4 w-4 stroke-current" />
                              <span className="text-nowrap" title={file.name}>{file.name}</span>
                              <X
                                  className="h-4 w-4 stroke-current"
                                  onClick={() => handleRemoveAttachment(attachments.indexOf(file))}
                              />
                            </div>
                        ))}
                  </div>
              )}
            </div>
        )}

        {/* Message Input Area */}
        <form
            onSubmit={form.handleSubmit(onSubmit)}
            className={`${channelIsBlocked ? "force-hide" : ""} flex items-end gap-3 px-4 py-3 bg-white shadow flex-shrink-0`}
        >
          <div className="flex justify-center items-center px-2 h-full">
            <FolderOpen
                className="text-gray-800 folder-size cursor-pointer"
                size={24}
                strokeWidth={1.5}
                onClick={() => {
                  document.getElementById("fileInput")?.click();
                }}
            />
            <input
                id="fileInput"
                type="file"
                className="hidden"
                onChange={handleAddAttachment}
                multiple={true}
            />
          </div>

          <Controller
              name="message"
              control={form.control}
              render={({field}) => (
                  <textarea
                      {...field}
                      id="chatScreenInputArea"
                      placeholder="Send a message..."
                      className={`${channelIsBlocked ? "force-hide" : ""} flex-1 px-4 py-2 border bg-white rounded-xl text-sm focus:outline-none resize-none`}
                      style={{scrollbarWidth: "none"}}
                      rows={1}
                      onChange={(e) => {
                        field.onChange(e);
                        adjustTextAreaHeight(e.target);
                      }}
                  />
              )}
          />

          <Button
              type="submit"
              variant="ghost"
              aria-label="Send"
              className="rounded-full bg-white w-10 h-10 flex items-center justify-center"
              style={{transform: "rotate(45deg)"}}
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
                style={{position: "relative", left: "-1.5px", top: "1.5px"}}
            />
          </Button>
        </form>
      </div>
  );
};

export default ChatScreen;
