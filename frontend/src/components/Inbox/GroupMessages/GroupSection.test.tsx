import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { vi } from "vitest";
import GroupSection from "./GroupSection";
import { GroupSectionProps } from "@/types/dmchannels";
import MessagingDashboardChannelItem from "../DirectMessagesDashboard/MessagingDashboardChannelItem";

vi.mock("../DirectMessagesDashboard/MessagingDashboardChannelItem", () => ({
  __esModule: true,
  default: vi.fn(({ extraInfo }) => (
    <div data-testid="messaging-channel-item">{extraInfo}</div>
  )),
}));

describe("GroupSection Component", () => {
  const mockProps: GroupSectionProps = {
    groupChannels: [
      {
        channelId: 1,
        channelName: "Group 1",
        channelImageBlob: "image-1.png",
        channelType: "group",
        lastMessage: "Hello from Group 1",
        lastEvent: null,
        read: false, // Unread
      },
      {
        channelId: 2,
        channelName: "Group 2",
        channelImageBlob: "image-2.png",
        channelType: "group",
        lastMessage: "Hello from Group 2",
        lastEvent: "Event 2",
        read: true, // Read
      },
    ],
  };

  it("renders the unread indicator (Dot) for unread channels", () => {
    render(<GroupSection {...mockProps} />);
    const unreadIndicator = screen.getByTestId("unread-dot-1");
    expect(unreadIndicator).toBeInTheDocument();
  });

  it("does not render unread indicator (Dot) for read channels", () => {
    render(<GroupSection {...mockProps} />);
    const readIndicator = screen.queryByTestId("unread-dot-2");
    expect(readIndicator).not.toBeInTheDocument();
  });

  it("renders the correct number of group channels", () => {
    render(<GroupSection {...mockProps} />);
    const channelItems = screen.getAllByTestId("messaging-channel-item");
    expect(channelItems.length).toBe(mockProps.groupChannels.length);
  });
});
