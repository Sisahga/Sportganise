import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import AccountPopUp from "./accountPopUp";

const mockUsePersonalInformation = vi.fn();
vi.mock("@/hooks/usePersonalInfromation", () => ({
  default: (accountId: number) => mockUsePersonalInformation(accountId),
}));

const mockCreateChannel = vi.fn();
vi.mock("@/hooks/useCreateChannel", () => ({
  default: () => ({
    createChannel: mockCreateChannel,
  }),
}));

const mockGetCookies = vi.fn();
const mockGetAccountIdCookie = vi.fn();
vi.mock("@/services/cookiesService", () => ({
  getCookies: () => mockGetCookies(),
  getAccountIdCookie: (cookies: unknown) => mockGetAccountIdCookie(cookies),
}));

const mockNavigate = vi.fn();
vi.mock("react-router", () => ({
  useNavigate: () => mockNavigate,
}));

describe("AccountPopUp Component", () => {
  const defaultProps = {
    accountId: 2,
    isOpen: true,
    onClose: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("renders loading state", () => {
    mockUsePersonalInformation.mockReturnValue({
      data: null,
      loading: true,
      error: false,
    });
    render(<AccountPopUp {...defaultProps} />);
    expect(screen.getByText(/Loading.../i)).toBeInTheDocument();
  });

  test("renders error state", () => {
    mockUsePersonalInformation.mockReturnValue({
      data: null,
      loading: false,
      error: true,
    });
    render(<AccountPopUp {...defaultProps} />);
    expect(
      screen.getByText(/Failed to load account details/i),
    ).toBeInTheDocument();
  });

  test("renders account details when data is available", () => {
    const accountData = {
      pictureUrl: "test.jpg",
      firstName: "John",
      lastName: "Doe",
      email: "john@example.com",
      phone: "1234567890",
      type: "attendee",
    };
    mockUsePersonalInformation.mockReturnValue({
      data: accountData,
      loading: false,
      error: false,
    });
    render(<AccountPopUp {...defaultProps} />);
    expect(screen.getByText(/John Doe/i)).toBeInTheDocument();
    expect(screen.getByText(/john@example.com/i)).toBeInTheDocument();
    expect(screen.getByText(/1234567890/i)).toBeInTheDocument();
  });

  test("calls handleSendMessage and navigates on successful channel creation", async () => {
    const accountData = {
      pictureUrl: "test.jpg",
      firstName: "John",
      lastName: "Doe",
      email: "john@example.com",
      phone: "1234567890",
      type: "attendee",
    };
    mockUsePersonalInformation.mockReturnValue({
      data: accountData,
      loading: false,
      error: false,
    });
    mockGetCookies.mockReturnValue({ some: "cookie" });
    mockGetAccountIdCookie.mockReturnValue(1);
    mockCreateChannel.mockResolvedValue({
      statusCode: 201,
      data: {
        channelId: 42,
        channelName: "Test Channel",
        channelType: "SIMPLE",
        avatarUrl: "avatar.png",
      },
    });
    render(<AccountPopUp {...defaultProps} />);
    const sendMessageButton = screen.getByRole("button", {
      name: /Send Message/i,
    });
    userEvent.click(sendMessageButton);
    await waitFor(() => {
      expect(mockCreateChannel).toHaveBeenCalled();
    });
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith(
        "/pages/DirectMessageChannelPage",
        {
          state: {
            channelId: 42,
            channelName: "Test Channel",
            channelType: "SIMPLE",
            channelImageBlob: "avatar.png",
            read: false,
          },
        },
      );
    });
  });
});
