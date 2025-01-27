import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { vi } from "vitest";
import MessagingDashboard from "./MessagingDashboard";
import { Channel } from "@/types/dmchannels";
import directMessagingApi from "@/services/api/directMessagingApi";

vi.mock("@/services/api/directMessagingApi", () => ({
  __esModule: true,
  default: {
    getChannels: vi.fn(),
  },
}));

vi.mock("@/components/Inbox/GroupMessages/GroupSection", () => ({
  __esModule: true,
  default: vi.fn(({ groupChannels }: { groupChannels: Channel[] }) => (
    <div data-testid="group-section">
      {groupChannels.map((channel: Channel) => (
        <div
          key={channel.channelId}
          data-testid={`group-channel-${channel.channelId}`}
        >
          {channel.channelName}
        </div>
      ))}
    </div>
  )),
}));

vi.mock("../SimpleMessages/MessagesSection", () => ({
  __esModule: true,
  default: vi.fn(({ messageChannels }: { messageChannels: Channel[] }) => (
    <div data-testid="messages-section">
      {messageChannels.map((channel: Channel) => (
        <div
          key={channel.channelId}
          data-testid={`message-channel-${channel.channelId}`}
        >
          {channel.channelName}
        </div>
      ))}
    </div>
  )),
}));

describe("MessagingDashboard Component", () => {
  const mockChannels: Channel[] = [
    {
      channelId: 1,
      channelName: "Group Chat 1",
      channelImageBlob: "image-1.png",
      channelType: "GROUP",
      lastMessage: "Hello Group 1",
      lastEvent: "2025-01-24T12:00:00Z",
      read: false,
    },
    {
      channelId: 2,
      channelName: "Simple Chat 1",
      channelImageBlob: "image-2.png",
      channelType: "SIMPLE",
      lastMessage: "Hello Simple 1",
      lastEvent: "2025-01-24T11:00:00Z",
      read: true,
    },
  ];

  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("renders loading state initially", () => {
    render(<MessagingDashboard />);
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("renders error message when API call fails", async () => {
    (directMessagingApi.getChannels as jest.Mock).mockRejectedValue(
      new Error("API Error"),
    );
    render(<MessagingDashboard />);
    await waitFor(() =>
      expect(screen.getByText("Failed to load messages.")).toBeInTheDocument(),
    );
  });

  it("renders the dashboard with fetched channels", async () => {
    (directMessagingApi.getChannels as jest.Mock).mockResolvedValue(
      mockChannels,
    );
    render(<MessagingDashboard />);

    await waitFor(() => {
      expect(screen.getByTestId("group-section")).toBeInTheDocument();
      expect(screen.getByTestId("messages-section")).toBeInTheDocument();
    });

    expect(screen.getByTestId("group-channel-1")).toHaveTextContent(
      "Group Chat 1",
    );
    expect(screen.getByTestId("message-channel-2")).toHaveTextContent(
      "Simple Chat 1",
    );
  });

  it("filters channels into group and simple sections correctly", async () => {
    (directMessagingApi.getChannels as jest.Mock).mockResolvedValue(
      mockChannels,
    );
    render(<MessagingDashboard />);

    await waitFor(() => {
      expect(screen.getByTestId("group-channel-1")).toBeInTheDocument();
      expect(screen.getByTestId("message-channel-2")).toBeInTheDocument();
    });
  });
});
