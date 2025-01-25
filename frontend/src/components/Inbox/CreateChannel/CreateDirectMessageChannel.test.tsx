/// <reference types="vitest/globals" />
import "@testing-library/jest-dom";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import CreateDirectMessagingChannel from "./CreateDirectMessageChannel";
import { useNavigate } from "react-router-dom";
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

vi.mock("react-router-dom", () => ({
  ...vi.importActual("react-router-dom"),
  useNavigate: vi.fn(),
}));

vi.mock("@/hooks/useCreateChannel", () => ({
  default: vi.fn(),
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

  it("renders the header, title, and AddMembers component correctly", () => {
    render(<CreateDirectMessagingChannel />);
    const buttons = screen.getAllByRole("button");
    expect(buttons).toHaveLength(5);
    const backButton = buttons[0];
    expect(backButton).toBeInTheDocument();
    const title = screen.getByText("Messages");
    expect(title).toBeInTheDocument();
    const mainHeading = screen.getByText(
      "Chat with other players and coaches!",
    );
    expect(mainHeading).toBeInTheDocument();
    const addMembers = screen.getByTestId("add-members-mock");
    expect(addMembers).toBeInTheDocument();
  });

  it("navigates back when the back button is clicked", () => {
    render(<CreateDirectMessagingChannel />);
    const buttons = screen.getAllByRole("button");
    const backButton = buttons[0];
    fireEvent.click(backButton);
    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });

  it("creates a SIMPLE channel and navigates correctly when creating a channel with one user", async () => {
    mockCreateChannel.mockResolvedValue({
      statusCode: 201,
      data: {
        channelId: 456,
        channelName: "Test Channel",
        channelType: "SIMPLE",
        avatarUrl: "https://example.com/avatar.png",
      },
    });

    render(<CreateDirectMessagingChannel />);
    fireEvent.click(screen.getByText("Select Alice"));
    fireEvent.click(screen.getByTestId("create-channel-button"));

    await waitFor(() => {
      expect(mockCreateChannel).toHaveBeenCalledWith(
        {
          channelId: null,
          channelName: "",
          channelType: "SIMPLE",
          memberIds: [1, 2],
          createdAt: expect.any(String),
          avatarUrl: null,
        },
        2,
      );
      expect(mockNavigate).toHaveBeenCalledWith(
        "/pages/DirectMessageChannelPage",
        {
          state: {
            channelId: 456,
            channelName: "Test Channel",
            channelType: "SIMPLE",
            channelImageBlob: "https://example.com/avatar.png",
            read: true,
          },
        },
      );
    });
  });

  it("creates a GROUP channel and navigates correctly when creating a channel with two users", async () => {
    mockCreateChannel.mockResolvedValue({
      statusCode: 201,
      data: {
        channelId: 789,
        channelName: "Group Channel",
        channelType: "GROUP",
        avatarUrl: "https://example.com/group-avatar.png",
      },
    });

    render(<CreateDirectMessagingChannel />);
    fireEvent.click(screen.getByText("Select Alice and Charlie"));
    fireEvent.click(screen.getByTestId("create-channel-button"));

    await waitFor(() => {
      expect(mockCreateChannel).toHaveBeenCalledWith(
        {
          channelId: null,
          channelName: "",
          channelType: "GROUP",
          memberIds: [1, 3, 2],
          createdAt: expect.any(String),
          avatarUrl: null,
        },
        2,
      );
      expect(mockNavigate).toHaveBeenCalledWith(
        "/pages/DirectMessageChannelPage",
        {
          state: {
            channelId: 789,
            channelName: "Group Channel",
            channelType: "GROUP",
            channelImageBlob: "https://example.com/group-avatar.png",
            read: true,
          },
        },
      );
    });
  });

  it("navigates correctly when the channel already exists (statusCode 302)", async () => {
    mockCreateChannel.mockResolvedValue({
      statusCode: 302,
      data: {
        channelId: 123,
        channelName: "Existing Channel",
        channelType: "SIMPLE",
        avatarUrl: "https://example.com/existing-avatar.png",
      },
    });

    render(<CreateDirectMessagingChannel />);
    fireEvent.click(screen.getByText("Select Alice"));
    fireEvent.click(screen.getByTestId("create-channel-button"));

    await waitFor(() => {
      expect(mockCreateChannel).toHaveBeenCalledWith(
        {
          channelId: null,
          channelName: "",
          channelType: "SIMPLE",
          memberIds: [1, 2],
          createdAt: expect.any(String),
          avatarUrl: null,
        },
        2,
      );
      expect(mockNavigate).toHaveBeenCalledWith(
        "/pages/DirectMessageChannelPage",
        {
          state: {
            channelId: 123,
            channelName: "Existing Channel",
            channelType: "SIMPLE",
            channelImageBlob: "https://example.com/existing-avatar.png",
            read: false,
          },
        },
      );
    });
  });

  it("logs an error when channel creation fails", async () => {
    mockCreateChannel.mockResolvedValue({
      statusCode: 500,
      data: null,
    });

    render(<CreateDirectMessagingChannel />);
    fireEvent.click(screen.getByText("Select Alice"));
    fireEvent.click(screen.getByTestId("create-channel-button"));

    await waitFor(() => {
      expect(mockCreateChannel).toHaveBeenCalledWith(
        {
          channelId: null,
          channelName: "",
          channelType: "SIMPLE",
          memberIds: [1, 2],
          createdAt: expect.any(String),
          avatarUrl: null,
        },
        2,
      );
      expect(mockNavigate).not.toHaveBeenCalled();
      expect(log.error).toHaveBeenCalledWith("Error creating channel:", {
        statusCode: 500,
        data: null,
      });
    });
  });
});
