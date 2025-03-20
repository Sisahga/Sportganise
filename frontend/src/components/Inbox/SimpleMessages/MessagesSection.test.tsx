import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { vi } from "vitest";
import MessagesSection from "./MessagesSection";
import { MessagesSectionProps } from "@/types/dmchannels";

vi.mock("../DirectMessagesDashboard/MessagingDashboardChannelItem", () => ({
  __esModule: true,
  default: vi.fn(({ channel, extraInfo }) => (
    <div data-testid={`message-channel-item-${channel.channelId}`}>
      <div>{channel.channelName}</div>
      {extraInfo}
    </div>
  )),
}));

describe.skip("MessagesSection Component", () => {
  const mockProps: MessagesSectionProps = {
    messageChannels: [
      {
        channelId: 1,
        channelName: "Channel 1",
        channelImageBlob: "image-1.png",
        channelType: "direct",
        lastMessage: "Hello from Channel 1",
        lastEvent: "2025-01-23T14:00:00Z",
        read: false,
      },
      {
        channelId: 2,
        channelName: "Channel 2",
        channelImageBlob: "image-2.png",
        channelType: "direct",
        lastMessage: "Hello from Channel 2",
        lastEvent: "2025-01-22T15:00:00Z",
        read: true,
      },
    ],
  };

  it("renders without crashing", () => {
    render(<MessagesSection {...mockProps} />);
    expect(screen.getByText("Messages")).toBeInTheDocument();
  });

  it("renders the correct number of message channels", () => {
    render(<MessagesSection {...mockProps} />);
    const channelItems = screen.getAllByTestId(/message-channel-item-/);
    expect(channelItems.length).toBe(mockProps.messageChannels.length);
  });

  it("displays the correct formatted date for the last event", () => {
    render(<MessagesSection {...mockProps} />);
    //const lastEvent1 = screen.getByText("Thu");
    //expect(lastEvent1).toBeInTheDocument();
    //const lastEvent2 = screen.getByText("Wed");
    //expect(lastEvent2).toBeInTheDocument();
  });

  it("renders the unread indicator (Dot) for unread channels", () => {
    render(<MessagesSection {...mockProps} />);
    const unreadIndicator = screen
      .getByTestId("message-channel-item-1")
      .querySelector("svg");
    expect(unreadIndicator).toBeInTheDocument();
  });

  it("does not render the unread indicator (Dot) for read channels", () => {
    render(<MessagesSection {...mockProps} />);
    const readIndicator = screen
      .getByTestId("message-channel-item-2")
      .querySelector("svg");
    expect(readIndicator).not.toBeInTheDocument();
  });
});
