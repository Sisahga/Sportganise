// src/components/Inbox/ChatScreen/ChatScreen.test.tsx

import { describe, it, expect, beforeEach, vi, MockedFunction } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";

// ---------------------------------------------------------------------------
// 1) Mock react-router-dom with esModule: true
// ---------------------------------------------------------------------------
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    __esModule: true, // Important for ESM modules
    ...actual,
    useLocation: vi.fn(),
    useNavigate: vi.fn(),
  };
});

// ---------------------------------------------------------------------------
// 2) Mock useChatMessages
// ---------------------------------------------------------------------------
vi.mock("../../../hooks/useChatMessages.ts", () => {
  return {
    __esModule: true,
    default: vi.fn(),
  };
});

// ---------------------------------------------------------------------------
// 3) Mock useSendMessage
// ---------------------------------------------------------------------------
vi.mock("@/hooks/useSendMessage.ts", () => {
  return {
    __esModule: true,
    default: vi.fn().mockReturnValue({
      sendDirectMessage: vi.fn(),
    }),
  };
});

// ---------------------------------------------------------------------------
// Now import the modules we just mocked
// ---------------------------------------------------------------------------
import { useLocation, useNavigate } from "react-router-dom";
import useChatMessages from "../../../hooks/useChatMessages.ts";
import useSendMessage from "@/hooks/useSendMessage.ts";
import ChatScreen from "./ChatScreen";

// ---------------------------------------------------------------------------
// Import necessary types
// ---------------------------------------------------------------------------
import { SendMessageComponent, MessageComponent } from "@/types/messaging.ts";
import WebSocketService from "@/services/WebSocketService.ts";

// ---------------------------------------------------------------------------
// Define the structure returned by useChatMessages hook
// ---------------------------------------------------------------------------
interface MockUseChatMessagesReturn {
  messages: MessageComponent[];
  setMessages: React.Dispatch<React.SetStateAction<MessageComponent[]>>;
  loading: boolean;
  error: string | null;
}

// ---------------------------------------------------------------------------
// Define the type for the sendDirectMessage function
// ---------------------------------------------------------------------------
type SendDirectMessageMock = MockedFunction<
  (message: SendMessageComponent, ws: WebSocketService | null) => void
>;

// ---------------------------------------------------------------------------
// Define the structure returned by useSendMessage hook
// ---------------------------------------------------------------------------
interface MockUseSendMessageReturn {
  sendDirectMessage: SendDirectMessageMock;
}

// ---------------------------------------------------------------------------
// Create typed aliases for our mocked functions
// ---------------------------------------------------------------------------
type UseLocationMock = MockedFunction<typeof useLocation>;
type UseNavigateMock = MockedFunction<typeof useNavigate>;
type UseChatMessagesMock = MockedFunction<typeof useChatMessages>;
type UseSendMessageMock = MockedFunction<typeof useSendMessage>;

describe("ChatScreen", () => {
  const mockNavigate = vi.fn();
  let mockUseChatMessagesReturn: MockUseChatMessagesReturn;
  let mockSendDirectMessage: SendDirectMessageMock;
  let mockUseSendMessageReturn: MockUseSendMessageReturn;

  beforeEach(() => {
    vi.clearAllMocks();

    // -----------------------------------------------------------------------
    // Provide ALL required fields for a Location object:
    // { pathname, search, hash, key, state }
    // -----------------------------------------------------------------------
    (useLocation as UseLocationMock).mockReturnValue({
      pathname: "/some-path",
      search: "",
      hash: "",
      key: "mockKey",
      state: {
        channelId: 123,
        channelName: "Test Channel",
        channelImageBlob: "/test-avatar.png",
        read: false,
        channelType: "SIMPLE",
        isBlocked: false,
      },
    });

    // useNavigate returns our spy function
    (useNavigate as UseNavigateMock).mockReturnValue(mockNavigate);

    // Default data for useChatMessages
    mockUseChatMessagesReturn = {
      messages: [],
      setMessages: vi.fn(),
      loading: false,
      error: null,
    };
    (useChatMessages as UseChatMessagesMock).mockReturnValue(
      mockUseChatMessagesReturn,
    );

    // Default data for useSendMessage
    mockSendDirectMessage = vi.fn();
    mockUseSendMessageReturn = {
      sendDirectMessage: mockSendDirectMessage,
    };
    (useSendMessage as UseSendMessageMock).mockReturnValue(
      mockUseSendMessageReturn,
    );
  });

  // -------------------------------------------------------------------------
  // 1) Loading state
  // -------------------------------------------------------------------------
  it("shows a loading screen when loading is true", () => {
    mockUseChatMessagesReturn.loading = true;

    render(<ChatScreen />);
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  // -------------------------------------------------------------------------
  // 2) Error state
  // -------------------------------------------------------------------------
  it("shows an error message when error is present", () => {
    mockUseChatMessagesReturn.error = "Something went wrong";

    render(<ChatScreen />);
    expect(screen.getByText("Something went wrong")).toBeInTheDocument();
    expect(screen.getByText("Something went wrong")).toHaveClass(
      "text-red-500",
    );
  });

  // -------------------------------------------------------------------------
  // 3) Renders chat screen with messages
  // -------------------------------------------------------------------------
  it("renders the chat screen with messages", () => {
    mockUseChatMessagesReturn.messages = [
      {
        messageId: 1,
        channelId: 123,
        attachments: ["https://example.com/image.png"], // Changed to string[]
        type: "CHAT",
        senderId: 999,
        senderFirstName: "Alice",
        avatarUrl: "/alice.png",
        messageContent: "Hello from Alice",
        sentAt: "2023-10-01T10:00:00Z",
      },
    ];
    render(<ChatScreen />);

    // Channel name from location.state
    expect(screen.getByText("Test Channel")).toBeInTheDocument();
    // The message content
    expect(screen.getByText("Hello from Alice")).toBeInTheDocument();
  });

  // -------------------------------------------------------------------------
  // 4) Navigation back
  // -------------------------------------------------------------------------
  it("navigates back when clicking the back button", () => {
    render(<ChatScreen />);
    // Locate the back button using aria-label
    const backButton = screen.getByRole("button", { name: /back/i });
    fireEvent.click(backButton);

    // Expect navigate("/pages/DirectMessagesDashboard") to have been called
    expect(mockNavigate).toHaveBeenCalledWith("/pages/DirectMessagesDashboard");
  });

  // -------------------------------------------------------------------------
  // 5) Disables send button if input is empty
  // -------------------------------------------------------------------------
  it("disables the send button if the message is empty", () => {
    render(<ChatScreen />);

    // Locate the send button using aria-label
    const sendButton = screen.getByRole("button", { name: /send/i });
    expect(sendButton).toBeDisabled();
  });

  // -------------------------------------------------------------------------
  // 6) Sends a message when the send button is clicked
  // -------------------------------------------------------------------------
  it("sends a message when the send button is clicked", () => {
    render(<ChatScreen />);

    // Type a message
    const textArea = screen.getByPlaceholderText("Send a message...");
    fireEvent.change(textArea, { target: { value: "Hello World" } });

    // The send button should now be enabled
    const sendButton = screen.getByRole("button", { name: /send/i });
    expect(sendButton).not.toBeDisabled();

    // Click it
    fireEvent.click(sendButton);

    // Check that sendDirectMessage was called
    expect(mockSendDirectMessage).toHaveBeenCalledTimes(1);

    // Check payload
    const payloadArg = mockSendDirectMessage.mock.calls[0][0];
    expect(payloadArg).toMatchObject({
      senderId: 2, // from ChatScreen's currentUserId
      channelId: 123, // from location.state
      messageContent: "Hello World",
      type: "CHAT",
    });

    // After sending, input should be cleared
    expect((textArea as HTMLTextAreaElement).value).toBe("");
  });

  // -------------------------------------------------------------------------
  // 7) If channel is blocked, hides the input area
  // -------------------------------------------------------------------------
  it("if channel is blocked, hides the input area", () => {
    (useLocation as UseLocationMock).mockReturnValue({
      pathname: "/some-path",
      search: "",
      hash: "",
      key: "mockKey",
      state: {
        channelId: 123,
        channelName: "Blocked Channel",
        channelImageBlob: "/blocked-avatar.png",
        read: false,
        channelType: "SIMPLE",
        isBlocked: true,
      },
    });

    render(<ChatScreen />);

    // <div id="chatScreenInputArea" className={`${channelIsBlocked ? "force-hide" : ""} ...`}>
    const inputArea = document.getElementById("chatScreenInputArea");
    expect(inputArea).toHaveClass("force-hide");
  });
});
