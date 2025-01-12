/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, MoreHorizontal, Send, FolderOpen } from "lucide-react";
import useChatMessages from "../../../hooks/useChatMessages.tsx";
import defaultAvatar from "../../../assets/defaultAvatar.png";
import "./ChatScreen.css";
import WebSocketService from "@/services/WebSocketService.ts";
import { SendMessageComponent } from "@/types/messaging.ts";
import ChatMessages from "@/components/Inbox/ChatScreen/ChatMessages.tsx";
import { Button } from "@/components/ui/Button.tsx";

const ChatScreen = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Access chat data from location state
  const { state } = location || {};
  const channelId = state?.channelId || null;
  const channelName = state?.channelName || null;
  const channelImageBlob = state?.channelImageBlob || defaultAvatar;
  const read = state?.read || false;
  // const channelType = state?.channelType || null; /* Maybe we'll use it later */

  const [connected, setConnected] = useState(false);
  const webSocketServiceRef = useRef<WebSocketService | null>(null);
  const { messages, setMessages, loading, error } = useChatMessages(
    channelId,
    read,
  );
  const [newMessage, setNewMessage] = useState("");

  const connectWebSocket = async () => {
    webSocketServiceRef.current = new WebSocketService(onMessageReceived);
    const connSuccess = await webSocketServiceRef.current.connect();
    setConnected(connSuccess);
  };

  const onMessageReceived = (message: any) => {
    setMessages((prevMessages) => [...prevMessages, message]);
  };

  const handleSend = () => {
    if (newMessage.trim() === "") return;

    // Send the new message to the server
    const messagePayload: SendMessageComponent = {
      senderId: 2, // TODO: Replace with actual sender ID from cookies
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
    webSocketServiceRef.current?.sendMessage(messagePayload);

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
    console.log("Messages fetched:", messages);
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
        {/* Back Button */}
        <Button
          variant="ghost"
          className="rounded-full bg-white w-10 h-10 flex items-center justify-center"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="text-gray-800" size={28} strokeWidth={3} />
        </Button>

        {/* Chat Information */}
        <div className="flex flex-grow items-center gap-3">
          <img
            src={channelImageBlob}
            alt={channelName}
            style={{ width: "40px", height: "40px" }}
            className="rounded-full object-cover"
          />
          <h1 className="text-lg font-bold text-gray-800">{channelName}</h1>
        </div>

        {/* Options Button */}
        <button className="p-2 rounded-full bg-placeholder-colour hover:bg-gray-300">
          <MoreHorizontal size={20} />
        </button>
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
      <ChatMessages messages={messages} />

      {/* Message Input Area */}
      <div className="flex items-center gap-3 px-4 py-3 bg-white shadow">
        <div className="h-full flex items-end">
          <Button
            variant="ghost"
            className="rounded-full bg-white w-10 h-10 flex items-center justify-center"
          >
            <FolderOpen
              className="text-gray-800 folder-size"
              size={24}
              strokeWidth={1.5}
            />
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

        {/* Send Button */}
        <div className="h-full flex items-end">
          <Button
            variant="ghost"
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
