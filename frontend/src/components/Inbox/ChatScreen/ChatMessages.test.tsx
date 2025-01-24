import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

import ChatMessages from "./ChatMessages"; // Adjust if needed

// Utility: create a DOM element for "#chatScreenInputArea" if we test BLOCK logic
function setupChatScreenInputArea() {
  const inputArea = document.createElement("div");
  inputArea.id = "chatScreenInputArea";
  document.body.appendChild(inputArea);
  return inputArea;
}

describe("ChatMessages", () => {
  beforeEach(() => {
    // Clear any prior DOM or mocks
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

    // Check first message
    expect(screen.getByText("Hello!")).toBeInTheDocument();
    // Current user is senderId=100 => no avatar for own messages
    expect(
      screen.queryByRole("img", { name: /alice\.png/i }),
    ).not.toBeInTheDocument();

    // Check second message
    expect(screen.getByText("Hi, Alice!")).toBeInTheDocument();
    // Bob's avatar should appear
    const bobAvatar = screen.getByRole("img") as HTMLImageElement;
    expect(bobAvatar.src).toContain("bob.png");
  });

  it("shows a JOIN message in the correct text", () => {
    // " from the user " is rendered with leading/trailing spaces
    // We'll use a partial/regex match to find it
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
    // Because currentUserId=100 != senderId=999, it uses messageContent.split("*")[3]
    // which is " from the user " in your component.
    // We'll match using a regex ignoring leading/trailing spaces:
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
    // The last message is BLOCK => the code disables #chatScreenInputArea
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
        // 10:00 UTC
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
        // 10:16 UTC => 16 min difference from 10:00
        sentAt: "2023-10-01T10:16:00Z",
      },
    ];

    render(<ChatMessages messages={messages} currentUserId={100} />);

    // The code checks differenceInMinutes(...) > 15 => show a new timestamp
    // We can expect 2 timestamps. By default, your code shows a timestamp for the first message.
    // Then it sees a 16-min difference => shows a second timestamp.

    // Let's find elements with your timestamp class ".text-xs.text-gray-500.text-center.mb-2"
    const timeStamps = screen.queryAllByText((_content, element) => {
      if (!element) return false;
      return (
        element.className.includes("text-xs") &&
        element.className.includes("text-gray-500") &&
        element.className.includes("text-center")
      );
    });

    // Should have 2 separate timestamps now
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
        // 10:00 UTC
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
        // 10:10 UTC => 10 min difference from 10:00
        sentAt: "2023-10-01T10:10:00Z",
      },
    ];

    render(<ChatMessages messages={messages} currentUserId={100} />);

    // The difference is 10 min => not > 15 => second timestamp is NOT displayed

    const timeStamps = screen.queryAllByText((_content, element) => {
      if (!element) return false;
      return (
        element.className.includes("text-xs") &&
        element.className.includes("text-gray-500") &&
        element.className.includes("text-center")
      );
    });

    // Expect only one timestamp: for the first message
    expect(timeStamps).toHaveLength(1);
  });
});
