// src/components/Inbox/ChatScreen/ChatScreen.tsx
import { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, Send, FolderOpen } from "lucide-react";
import useChatMessages from "../../../hooks/useChatMessages.ts";
import defaultAvatar from "../../../assets/defaultAvatar.png";
import defaultGroupAvatar from "../../../assets/defaultGroupAvatar.png";
import "./ChatScreen.css";
import WebSocketService from "@/services/WebSocketService.ts";
import { SendMessageComponent } from "@/types/messaging.ts";
import ChatMessages from "@/components/Inbox/ChatScreen/ChatMessages.tsx";
import { Button } from "@/components/ui/Button.tsx";
import ChannelSettingsDropdown from "./Settings/ChannelSettingsDropdown.tsx";
import useSendMessage from "@/hooks/useSendMessage.ts";
import UserBlockedComponent from "@/components/Inbox/ChatScreen/Settings/UserBlockedComponent.tsx";
import log from "loglevel";

const ChatScreen = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Access chat data from location state
  const { state } = location || {};
  const channelId = state?.channelId;
  const channelName = state?.channelName || null;
  const channelImageBlob = state?.channelImageBlob || defaultAvatar;
  const read = state?.read || false;
  const channelType = state?.channelType || null;
  const isBlocked = state?.isBlocked || false;
  const currentUserId = 2; // TODO: Replace with actual user ID from cookies

  // States
  const [connected, setConnected] = useState(false);
  const webSocketServiceRef = useRef<WebSocketService | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [channelIsBlocked, setChannelIsBlocked] = useState(isBlocked);
  const [currentChannelName, setCurrentChannelName] = useState(channelName);
  const [currentChannelImageUrl, setCurrentChannelImageUrl] =
    useState(channelImageBlob);

  // Hooks
  const { messages, setMessages, loading, error } = useChatMessages(channelId, read);
  const { sendDirectMessage } = useSendMessage();

  const connectWebSocket = async () => {
    webSocketServiceRef.current = new WebSocketService(onMessageReceived);
    const connSuccess = await webSocketServiceRef.current.connect();
    setConnected(connSuccess);
  };

  const onMessageReceived = (message: any) => {
    setMessages((prevMessages) => [...prevMessages, message]);
    if (message.type === "BLOCK") {
      setChannelIsBlocked(true);
    } else if (message.type === "UNBLOCK") {
      setChannelIsBlocked(false);
    }
  };

  const handleSend = () => {
    if (newMessage.trim() === "") return;

    // Send the new message to the server
    const messagePayload: SendMessageComponent = {
      senderId: currentUserId, // TODO: Replace with actual sender ID from cookies
      channelId: channelId,
      messageContent: newMessage,
      attachments: [],
      sentAt: new Date().toISOString(),
      type: "CHAT",
      senderFirstName: "Walter", // TODO: Replace with actual first name from cookies
      avatarUrl:
        "https://sportganise-bucket.s3.us-east-2.amazonaws.com/walter_white_avatar.jpg",
      // TODO: Replace with actual avatar url from cookies
    };

    sendDirectMessage(messagePayload, webSocketServiceRef.current);
    setNewMessage("");
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
  }, []);

  useEffect(() => {
    log.debug("Messages fetched:", messages);
  }, [messages]);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const adjustHeight = () => {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    };

    adjustHeight();

    window.addEventListener("resize", adjustHeight);
    return () => window.removeEventListener("resize", adjustHeight);
  }, [newMessage]);

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
    <div id="chatScreenMainCtn" className="flex flex-col h-screen bg-gray-100">
      {/* Header */}
      <header className="pt-8 flex items-center justify-between px-4 py-3 bg-white shadow gap-4">
        {/* Back Button with aria-label */}
        <Button
          variant="ghost"
          aria-label="Back" 
          className="rounded-full bg-white w-10 h-10 flex items-center justify-center"
          onClick={() => navigate("/pages/DirectMessagesDashboard")}
        >
          <ArrowLeft className="text-gray-800" size={28} strokeWidth={3} />
        </Button>

        {/* Chat Information */}
        <div className="flex flex-grow items-center gap-3">
          <img
            src={currentChannelImageUrl}
            alt={defaultGroupAvatar}
            style={{ width: "40px", height: "40px" }}
            className="rounded-full object-cover"
          />
          <h1 className="text-lg font-bold text-gray-800">{currentChannelName}</h1>
        </div>

        {/* Options Button */}
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
      <div
        id="chatScreenInputArea"
        className={`${channelIsBlocked ? "force-hide" : ""}
           flex items-center gap-3 px-4 py-3 bg-white shadow`}
      >
        <div className="h-full flex items-end">
          <Button
            variant="ghost"
            className="rounded-full bg-white w-10 h-10 flex items-center justify-center"
          >
            <FolderOpen className="text-gray-800 folder-size" size={24} strokeWidth={1.5} />
          </Button>
        </div>

        {/* Text Input */}
        <textarea
          ref={textareaRef}
          placeholder="Send a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="flex-1 px-4 py-2 border bg-white rounded-xl text-sm focus:outline-none"
          style={{ scrollbarWidth: "none" }}
          rows={1}
        />

        {/* Send Button with aria-label */}
        <div className="h-full flex items-end">
          <Button
            variant="ghost"
            aria-label="Send" 
            className="rounded-full bg-white w-10 h-10 flex items-center justify-center"
            style={{ transform: "rotate(45deg)" }}
            onClick={handleSend}
            disabled={newMessage.trim() === ""}
          >
            <Send
              className={`folder-size ${newMessage.trim() === "" ? "faded-primary-colour" : "secondary-colour"}`}
              size={20}
              strokeWidth={2}
              style={{ position: "relative", left: "-1.5px", top: "1.5px" }}
            />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatScreen;
