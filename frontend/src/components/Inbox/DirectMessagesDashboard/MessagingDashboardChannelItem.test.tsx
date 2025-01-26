import { render, screen, fireEvent, within } from "@testing-library/react";
import "@testing-library/jest-dom";
import { vi } from "vitest";
import { MemoryRouter } from "react-router";
import MessagingDashboardChannelItem from "@/components/Inbox/DirectMessagesDashboard/MessagingDashboardChannelItem";
import useLastMessage from "@/hooks/useLastMessage";

vi.mock("@/hooks/useLastMessage", () => ({
  __esModule: true,
  default: vi.fn(),
}));

const mockNavigate = vi.fn();
vi.mock("react-router", async (importOriginal) => {
  const actual = (await importOriginal()) as object;
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe("MessagingDashboardChannelItem Component", () => {
  const mockChannel = {
    channelId: 1,
    channelName: "Test Channel",
    channelImageBlob: "https://via.placeholder.com/150",
    channelType: "DIRECT",
    lastMessage: "Hello World",
    lastEvent: null,
    read: false,
  };

  const mockLastMessage = {
    type: "BLOCK",
    messageContent: "BLOCK*2*User is blocked*Blocked by admin",
  };

  beforeEach(() => {
    (useLastMessage as jest.Mock).mockReturnValue({
      lastMessage: mockLastMessage,
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders the component in horizontal layout", () => {
    render(
      <MemoryRouter>
        <MessagingDashboardChannelItem
          channel={mockChannel}
          layout="horizontal"
          extraInfo={<div data-testid="extra-info">Extra Info</div>}
        />
      </MemoryRouter>,
    );

    const channelItem = screen.getByRole("button");
    expect(channelItem).toBeInTheDocument();
    expect(screen.getByText("Test Channel")).toBeInTheDocument();
    expect(screen.getByText("Hello World")).toBeInTheDocument();
    expect(screen.getByTestId("extra-info")).toBeInTheDocument();
  });

  it("renders the component in vertical layout", () => {
    render(
      <MemoryRouter>
        <MessagingDashboardChannelItem
          channel={mockChannel}
          layout="vertical"
          extraInfo={<div data-testid="extra-info">Extra Info</div>}
        />
      </MemoryRouter>,
    );

    const channelButton = screen.getByRole("button");
    expect(channelButton).toBeInTheDocument();
    expect(screen.getByText("Test Channel")).toBeInTheDocument();
    expect(screen.getByTestId("extra-info")).toBeInTheDocument();
  });

  it("navigates to the correct route on click", () => {
    render(
      <MemoryRouter>
        <MessagingDashboardChannelItem
          channel={mockChannel}
          layout="horizontal"
          extraInfo={<div data-testid="extra-info">Extra Info</div>}
        />
      </MemoryRouter>,
    );

    const channelItem = screen.getByRole("button");
    fireEvent.click(channelItem);

    expect(mockNavigate).toHaveBeenCalledWith(
      "/pages/DirectMessageChannelPage",
      {
        state: {
          channelId: 1,
          channelName: "Test Channel",
          channelImageBlob: "https://via.placeholder.com/150",
          channelType: "DIRECT",
          read: false,
          isBlocked: true,
        },
      },
    );
  });

  it("handles Enter and Space key press for navigation", () => {
    render(
      <MemoryRouter>
        <MessagingDashboardChannelItem
          channel={mockChannel}
          layout="horizontal"
          extraInfo={<div data-testid="extra-info">Extra Info</div>}
        />
      </MemoryRouter>,
    );

    const channelItem = screen.getByRole("button");
    fireEvent.keyDown(channelItem, { key: "Enter" });
    expect(mockNavigate).toHaveBeenCalledTimes(1);

    fireEvent.keyDown(channelItem, { key: " " });
    expect(mockNavigate).toHaveBeenCalledTimes(2);
  });

  it("renders the last message correctly based on type", () => {
    render(
      <MemoryRouter>
        <MessagingDashboardChannelItem
          channel={mockChannel}
          layout="horizontal"
          extraInfo={<div data-testid="extra-info">Extra Info</div>}
        />
      </MemoryRouter>,
    );

    const channelItem = screen.getByRole("button");
    const lastMessage = within(channelItem).getByText("Hello World");
    expect(lastMessage).toBeInTheDocument();
  });
});
