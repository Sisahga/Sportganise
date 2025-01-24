import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

import ChatMessages from "./ChatMessages";

function setupChatScreenInputArea() {
  const inputArea = document.createElement("div");
  inputArea.id = "chatScreenInputArea";
  document.body.appendChild(inputArea);
  return inputArea;
}

describe("ChatMessages", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
    vi.resetAllMocks();
  });

  it("renders a list of CHAT messages with required fields", () => {
    const messages = [
      {
        messageId: 1,
        channelId: 10,
        attachments: [],
        type: "CHAT",
        senderId: 100,
        senderFirstName: "Alice",
        avatarUrl: "/alice.png",
        messageContent: "Hello!",
        sentAt: "2023-10-01T10:00:00Z",
      },
      {
        messageId: 2,
        channelId: 10,
        attachments: [],
        type: "CHAT",
        senderId: 200,
        senderFirstName: "Bob",
        avatarUrl: "/bob.png",
        messageContent: "Hi, Alice!",
        sentAt: "2023-10-01T10:20:00Z",
      },
    ];

    render(<ChatMessages messages={messages} currentUserId={100} />);

    expect(screen.getByText("Hello!")).toBeInTheDocument();
    expect(
      screen.queryByRole("img", { name: /alice\.png/i }),
    ).not.toBeInTheDocument();
    expect(screen.getByText("Hi, Alice!")).toBeInTheDocument();
    const bobAvatar = screen.getByRole("img") as HTMLImageElement;
    expect(bobAvatar.src).toContain("bob.png");
  });

  it("shows a JOIN message in the correct text", () => {
    const messages = [
      {
        messageId: 123,
        channelId: 999,
        attachments: [],
        type: "JOIN",
        senderId: 999,
        senderFirstName: "John",
        avatarUrl: "/john.png",
        messageContent: "some*join*message* from the user *stuff",
        sentAt: "2023-10-02T09:00:00Z",
      },
    ];

    render(<ChatMessages messages={messages} currentUserId={100} />);
    expect(screen.getByText(/from the user/i)).toBeInTheDocument();
  });

  it("applies pointer-events-none if the last message is BLOCK", () => {
    const inputArea = setupChatScreenInputArea();

    const messages = [
      {
        messageId: 1,
        channelId: 10,
        attachments: [],
        type: "CHAT",
        senderId: 200,
        senderFirstName: "Bob",
        avatarUrl: "/bob.png",
        messageContent: "Hello world!",
        sentAt: "2023-10-01T10:00:00Z",
      },
      {
        messageId: 2,
        channelId: 10,
        attachments: [],
        type: "BLOCK",
        senderId: 200,
        senderFirstName: "Bob",
        avatarUrl: "/bob.png",
        messageContent: "some*block*message* from the user *stuff",
        sentAt: "2023-10-01T10:05:00Z",
      },
    ];

    render(<ChatMessages messages={messages} currentUserId={100} />);
    expect(inputArea).toHaveClass("pointer-events-none", "opacity-70");
  });

  it("shows a second timestamp if messages are more than 15 minutes apart", () => {
    const messages = [
      {
        messageId: 1,
        channelId: 10,
        attachments: [],
        type: "CHAT",
        senderId: 100,
        senderFirstName: "Alice",
        avatarUrl: "/alice.png",
        messageContent: "First message",
        sentAt: "2023-10-01T10:00:00Z",
      },
      {
        messageId: 2,
        channelId: 10,
        attachments: [],
        type: "CHAT",
        senderId: 100,
        senderFirstName: "Alice",
        avatarUrl: "/alice.png",
        messageContent: "Second message (16 minutes later)",
        sentAt: "2023-10-01T10:16:00Z",
      },
    ];

    render(<ChatMessages messages={messages} currentUserId={100} />);

    const timeStamps = screen.queryAllByText((_content, element) => {
      if (!element) return false;
      return (
        element.className.includes("text-xs") &&
        element.className.includes("text-gray-500") &&
        element.className.includes("text-center")
      );
    });

    expect(timeStamps).toHaveLength(2);
  });

  it("omits second timestamp if messages are <= 15 minutes apart", () => {
    const messages = [
      {
        messageId: 1,
        channelId: 10,
        attachments: [],
        type: "CHAT",
        senderId: 100,
        senderFirstName: "Alice",
        avatarUrl: "/alice.png",
        messageContent: "First message",
        sentAt: "2023-10-01T10:00:00Z",
      },
      {
        messageId: 2,
        channelId: 10,
        attachments: [],
        type: "CHAT",
        senderId: 100,
        senderFirstName: "Alice",
        avatarUrl: "/alice.png",
        messageContent: "Second message (10 minutes later)",
        sentAt: "2023-10-01T10:10:00Z",
      },
    ];

    render(<ChatMessages messages={messages} currentUserId={100} />);

    const timeStamps = screen.queryAllByText((_content, element) => {
      if (!element) return false;
      return (
        element.className.includes("text-xs") &&
        element.className.includes("text-gray-500") &&
        element.className.includes("text-center")
      );
    });

    expect(timeStamps).toHaveLength(1);
  });
});
