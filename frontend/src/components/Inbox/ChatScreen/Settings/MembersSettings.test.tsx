import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { MembersSettingsDialog } from "./MembersSettings";
import { GroupChannelMemberRole } from "@/types/dmchannels";
import { CookiesDto } from "@/types/auth.ts";

vi.mock("@/services/api/directMessagingApi", () => ({
  default: {
    addChannelMembers: vi.fn().mockResolvedValue({ status: 201 }),
  },
}));

const removeChannelMemberMock = vi.fn().mockResolvedValue({ status: 200 });
vi.mock("@/hooks/useRemoveChannelMember", () => ({
  default: () => ({
    removeChannelMember: removeChannelMemberMock,
  }),
}));

const sendDirectMessageMock = vi.fn().mockResolvedValue(undefined);
vi.mock("@/hooks/useSendMessage", () => ({
  default: () => ({
    sendDirectMessage: sendDirectMessageMock,
  }),
}));

vi.mock("@/services/cookiesService", () => ({
  getCookies: vi.fn().mockReturnValue({
    firstName: "Alice",
    pictureUrl: "avatar.png",
    type: "admin",
  }),
  clearCookies: vi.fn(),
}));

vi.mock("@/components/Inbox/AddMembers", () => ({
  default: () => <div data-testid="add-members">AddMembers Component</div>,
}));

const mockCookies: CookiesDto = {
  accountId: 1,
  firstName: "John",
  lastName: "Doe",
  email: "john.doe@example.com",
  pictureUrl: "https://example.com/profile.jpg",
  type: "user",
  phone: "+1234567890",
  organisationIds: [101, 102],
  jwtToken: "fake.jwt.token",
};

describe("MembersSettingsDialog", () => {
  const onCloseMock = vi.fn();
  const websocketRef = null; // satisfies WebSocketService | null
  const channelId = 123; // channelId is a number
  const currentUserId = 1;
  const channelMembers = [
    {
      accountId: 1,
      firstName: "Alice",
      lastName: "Smith",
      avatarUrl: "avatar1.png",
      role: GroupChannelMemberRole.ADMIN,
    },
    {
      accountId: 2,
      firstName: "Bob",
      lastName: "Jones",
      avatarUrl: "avatar2.png",
      role: GroupChannelMemberRole.REGULAR,
    },
  ];

  beforeEach(() => {
    onCloseMock.mockClear();
    removeChannelMemberMock.mockClear();
    sendDirectMessageMock.mockClear();
  });

  it("renders the dialog with channel members", () => {
    render(
      <MembersSettingsDialog
        isOpen={true}
        onClose={onCloseMock}
        channelMembers={channelMembers}
        channelId={channelId}
        websocketRef={websocketRef}
        currentUserId={currentUserId}
        cookies={mockCookies}
      />,
    );
    expect(screen.getByText("Members Settings")).toBeTruthy();
    expect(screen.getByText("Alice Smith")).toBeTruthy();
    expect(screen.getByText("Bob Jones")).toBeTruthy();
  });

  it("opens alert dialog when remove button is clicked for a non-current user", async () => {
    render(
      <MembersSettingsDialog
        isOpen={true}
        onClose={onCloseMock}
        channelMembers={channelMembers}
        channelId={channelId}
        websocketRef={websocketRef}
        currentUserId={currentUserId}
        cookies={mockCookies}
      />,
    );
    const removeButton = screen.getByRole("button", {
      name: /Remove Bob Jones/i,
    });
    fireEvent.click(removeButton);
    await waitFor(() => {
      expect(screen.getByText("Are you sure?")).toBeTruthy();
    });
  });

  it.skip("confirms removal and calls removeChannelMember, sendDirectMessage, and onClose", async () => {
    render(
      <MembersSettingsDialog
        isOpen={true}
        onClose={onCloseMock}
        channelMembers={channelMembers}
        channelId={channelId}
        websocketRef={websocketRef}
        currentUserId={currentUserId}
        cookies={mockCookies}
      />,
    );
    const removeButton = screen.getByRole("button", {
      name: /Remove Bob Jones/i,
    });
    fireEvent.click(removeButton);
    await waitFor(() => {
      expect(screen.getByText("Are you sure?")).toBeTruthy();
    });
    const confirmButton = screen.getByText("Confirm");
    fireEvent.click(confirmButton);
    await waitFor(() => {
      expect(removeChannelMemberMock).toHaveBeenCalledWith(channelId, 2);
    });
    await waitFor(() => {
      expect(sendDirectMessageMock).toHaveBeenCalled();
    });
    await waitFor(() => {
      expect(onCloseMock).toHaveBeenCalled();
    });
  });

  it("opens add members dialog when Add Members button is clicked", () => {
    render(
      <MembersSettingsDialog
        isOpen={true}
        onClose={onCloseMock}
        channelMembers={channelMembers}
        channelId={channelId}
        websocketRef={websocketRef}
        currentUserId={currentUserId}
        cookies={mockCookies}
      />,
    );
    const addMembersButton = screen.getByRole("button", {
      name: /Add Members/i,
    });
    fireEvent.click(addMembersButton);
    expect(screen.getByTestId("add-members")).toBeTruthy();
  });
});
