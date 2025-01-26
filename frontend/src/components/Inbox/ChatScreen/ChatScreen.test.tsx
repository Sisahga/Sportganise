import { describe, it, expect, beforeEach, vi, MockedFunction } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";

vi.mock("react-router", async () => {
  const actual = await vi.importActual("react-router");
  return {
    __esModule: true,
    ...actual,
    useLocation: vi.fn(),
    useNavigate: vi.fn(),
  };
});

vi.mock("../../../hooks/useChatMessages.ts", () => {
  return {
    __esModule: true,
    default: vi.fn(),
  };
});

vi.mock("@/hooks/useSendMessage", () => {
  return {
    __esModule: true,
    default: vi.fn(),
  };
});

import { useLocation, useNavigate } from "react-router";
import useChatMessages from "../../../hooks/useChatMessages.ts";
import useSendMessage from "@/hooks/useSendMessage";
import ChatScreen from "./ChatScreen";

import { SendMessageComponent, MessageComponent } from "@/types/messaging.ts";
import WebSocketService from "@/services/WebSocketService.ts";

interface MockUseChatMessagesReturn {
  messages: MessageComponent[];
  setMessages: React.Dispatch<React.SetStateAction<MessageComponent[]>>;
  loading: boolean;
  error: string | null;
}

type SendDirectMessageMock = MockedFunction<
  (message: SendMessageComponent, ws: WebSocketService | null) => void
>;


interface MockUseSendMessageReturn {
  sendDirectMessage: SendDirectMessageMock;
}

type UseLocationMock = MockedFunction<typeof useLocation>;
type UseNavigateMock = MockedFunction<typeof useNavigate>;
type UseChatMessagesMock = MockedFunction<typeof useChatMessages>;
type UseSendMessageMock = MockedFunction<typeof useSendMessage>;


describe("ChatScreen", () => {
  const mockNavigate = vi.fn();
  let mockUseChatMessagesReturn: MockUseChatMessagesReturn;
  let mockSendDirectMessage: SendDirectMessageMock;
  let mockUseSendMessageReturn: MockUseSendMessageReturn;

  beforeEach(async () => {
    vi.clearAllMocks();
    vi.resetModules();

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

    (useNavigate as UseNavigateMock).mockReturnValue(mockNavigate);

    mockUseChatMessagesReturn = {
      messages: [],
      setMessages: vi.fn(),
      loading: false,
      error: null,
    };
    (useChatMessages as UseChatMessagesMock).mockReturnValue(
      mockUseChatMessagesReturn,
    );

    mockSendDirectMessage = vi.fn();
    mockUseSendMessageReturn = {
      sendDirectMessage: mockSendDirectMessage,
    };
    (useSendMessage as UseSendMessageMock).mockImplementation(() => mockUseSendMessageReturn);
  });
  
  it("shows a loading screen when loading is true", () => {
    mockUseChatMessagesReturn.loading = true;

    render(<ChatScreen />);
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("shows an error message when error is present", () => {
    mockUseChatMessagesReturn.error = "Something went wrong";

    render(<ChatScreen />);
    expect(screen.getByText("Something went wrong")).toBeInTheDocument();
    expect(screen.getByText("Something went wrong")).toHaveClass(
      "text-red-500",
    );
  });

  it("renders the chat screen with messages", () => {
    mockUseChatMessagesReturn.messages = [
      {
        messageId: 1,
        channelId: 123,
        attachments: [],
        type: "CHAT",
        senderId: 999,
        senderFirstName: "Alice",
        avatarUrl: "/alice.png",
        messageContent: "Hello from Alice",
        sentAt: "2023-10-01T10:00:00Z",
      },
    ];
    render(<ChatScreen />);

    expect(screen.getByText("Test Channel")).toBeInTheDocument();
    expect(screen.getByText("Hello from Alice")).toBeInTheDocument();
  });

  it("navigates back when clicking the back button", () => {
    render(<ChatScreen />);
    const backButton = screen.getByRole("button", { name: /back/i });
    fireEvent.click(backButton);
    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });

  it("disables the send button if the message is empty", () => {
    render(<ChatScreen />);
    const sendButton = screen.getByRole("button", { name: /send/i });
    expect(sendButton).toBeDisabled();
  });

  it("sends message when send button is clicked", async () => {
    render(<ChatScreen />, { wrapper: ({ children }) => <>{children}</> });

    const textarea = screen.getByPlaceholderText("Send a message...");
    const sendButton = screen.getByRole("button", { name: /send/i });

    fireEvent.change(textarea, { target: { value: "Hello World" } });

    fireEvent.click(sendButton);
    await waitFor(() => {
      expect(mockSendDirectMessage).toHaveBeenCalledWith(
        expect.objectContaining({
          messageContent: "Hello World",
          type: "CHAT",
        }),
        expect.any(Object)
      );
    });
  });

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
    const inputArea = document.getElementById("chatScreenInputArea");
    expect(inputArea).toBeDisabled;
  });
});
