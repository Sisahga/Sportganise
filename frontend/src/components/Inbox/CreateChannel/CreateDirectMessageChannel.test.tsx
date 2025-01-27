import "@testing-library/jest-dom";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import CreateDirectMessagingChannel from "./CreateDirectMessageChannel";
import { useNavigate } from "react-router";
import useCreateChannel from "@/hooks/useCreateChannel";
import log from "loglevel";
import type { Mock } from "vitest";

interface User {
  accountId: number;
  firstName: string;
  lastName: string;
  pictureUrl: string;
  type: string;
  phone: string;
  selected: boolean;
}

interface AddMembersMockProps {
  setSelectedUsers: React.Dispatch<React.SetStateAction<User[]>>;
  submitButtonLabel: string;
  createFunction: () => void;
}

vi.mock("react-router", () => ({
  ...vi.importActual("react-router"),
  useNavigate: vi.fn(),
}));

vi.mock("@/hooks/useCreateChannel", () => ({
  default: vi.fn(),
}));

vi.mock("@/services/cookiesService.ts", () => ({
  getCookies: vi.fn().mockReturnValue({}),
  getAccountIdCookie: vi.fn().mockReturnValue(2),
}));

vi.mock("../AddMembers", () => ({
  default: ({
    setSelectedUsers,
    submitButtonLabel,
    createFunction,
  }: AddMembersMockProps) => {
    return (
      <div data-testid="add-members-mock">
        <button
          onClick={() =>
            setSelectedUsers([
              {
                accountId: 1,
                firstName: "Alice",
                lastName: "Smith",
                pictureUrl: "",
                type: "PLAYER",
                phone: "111-111-1111",
                selected: true,
              },
              {
                accountId: 3,
                firstName: "Charlie",
                lastName: "Brown",
                pictureUrl: "",
                type: "PLAYER",
                phone: "333-333-3333",
                selected: true,
              },
            ])
          }
        >
          Select Alice and Charlie
        </button>
        <button
          onClick={() =>
            setSelectedUsers([
              {
                accountId: 1,
                firstName: "Alice",
                lastName: "Smith",
                pictureUrl: "",
                type: "PLAYER",
                phone: "111-111-1111",
                selected: true,
              },
            ])
          }
        >
          Select Alice
        </button>
        <button
          onClick={() =>
            setSelectedUsers([
              {
                accountId: 1,
                firstName: "Alice",
                lastName: "Smith",
                pictureUrl: "",
                type: "PLAYER",
                phone: "111-111-1111",
                selected: true,
              },
              {
                accountId: 3,
                firstName: "Charlie",
                lastName: "Brown",
                pictureUrl: "",
                type: "PLAYER",
                phone: "333-333-3333",
                selected: true,
              },
              {
                accountId: 4,
                firstName: "David",
                lastName: "Wilson",
                pictureUrl: "",
                type: "COACH",
                phone: "444-444-4444",
                selected: true,
              },
            ])
          }
        >
          Select Alice, Charlie, and David
        </button>
        <button onClick={createFunction} data-testid="create-channel-button">
          {submitButtonLabel}
        </button>
      </div>
    );
  },
}));

vi.spyOn(log, "info").mockImplementation(() => {});
vi.spyOn(log, "error").mockImplementation(() => {});

describe("CreateDirectMessagingChannel", () => {
  const mockNavigate = vi.fn();
  const mockCreateChannel = vi.fn();

  beforeEach(() => {
    vi.resetAllMocks();
    (useNavigate as unknown as Mock).mockReturnValue(mockNavigate);
    (useCreateChannel as unknown as Mock).mockReturnValue({
      createChannel: mockCreateChannel,
    });
  });

  it("should render the component with correct header and title", () => {
    render(<CreateDirectMessagingChannel />);

    expect(screen.getByRole("heading", { name: "Create Channel" })).toBeInTheDocument();
    expect(screen.getByText("Chat with other players and coaches!")).toBeInTheDocument();
    expect(screen.getByLabelText("back")).toBeInTheDocument();
  });

  it("should navigate back when clicking the back button", () => {
    render(<CreateDirectMessagingChannel />);

    fireEvent.click(screen.getByLabelText("back"));
    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });

  it("should create a simple channel with two members and navigate on success", async () => {
    mockCreateChannel.mockResolvedValueOnce({
      statusCode: 201,
      data: {
        channelId: "123",
        channelName: "",
        channelType: "SIMPLE",
        avatarUrl: null
      }
    });

    render(<CreateDirectMessagingChannel />);

    fireEvent.click(screen.getByText("Select Alice"));
    fireEvent.click(screen.getByTestId("create-channel-button"));

    await waitFor(() => {
      expect(mockCreateChannel).toHaveBeenCalled();

      const [[actualChannelDetails]] = mockCreateChannel.mock.calls;

      expect(actualChannelDetails).toEqual({
        channelId: null,
        channelName: "",
        channelType: "SIMPLE",
        memberIds: [1],
        avatarUrl: null,
        createdAt: expect.any(String)
      });

      expect(mockNavigate).toHaveBeenCalledWith(
          "/pages/DirectMessageChannelPage",
          expect.objectContaining({
            state: expect.objectContaining({
              channelId: "123",
              read: true
            })
          })
      );
    });
  });
  it("should create a group channel with three or more members", async () => {
    mockCreateChannel.mockResolvedValueOnce({
      statusCode: 201,
      data: {
        channelId: "456",
        channelName: "",
        channelType: "GROUP",
        avatarUrl: null
      }
    });

    render(<CreateDirectMessagingChannel />);

    fireEvent.click(screen.getByText("Select Alice, Charlie, and David"));
    fireEvent.click(screen.getByTestId("create-channel-button"));

    await waitFor(() => {
      expect(mockCreateChannel).toHaveBeenCalled();

      const [[actualChannelDetails]] = mockCreateChannel.mock.calls;

      expect(actualChannelDetails).toEqual({
        channelId: null,
        channelName: "",
        channelType: "GROUP",
        memberIds: [1, 3, 4],
        avatarUrl: null,
        createdAt: expect.any(String)
      });
    });
  });

  it("should handle existing channel redirect (302 status)", async () => {
    mockCreateChannel.mockResolvedValueOnce({
      statusCode: 302,
      data: {
        channelId: "789",
        channelName: "Existing Channel",
        channelType: "SIMPLE",
        avatarUrl: null
      }
    });

    render(<CreateDirectMessagingChannel />);

    fireEvent.click(screen.getByText("Select Alice"));
    fireEvent.click(screen.getByTestId("create-channel-button"));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith(
          "/pages/DirectMessageChannelPage",
          expect.objectContaining({
            state: expect.objectContaining({
              channelId: "789",
              read: false
            })
          })
      );
    });
  });
});
