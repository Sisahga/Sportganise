import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { RenameGroupDialog } from "./RenameGroupChat";
import { CookiesDto } from "@/types/auth.ts";

const renameChannelMock = vi.fn();
vi.mock("@/hooks/useRenameChannel", () => ({
  default: () => ({
    renameChannel: renameChannelMock,
  }),
}));

const sendDirectMessageMock = vi.fn();
vi.mock("@/hooks/useSendMessage", () => ({
  default: () => ({
    sendDirectMessage: sendDirectMessageMock,
  }),
}));

vi.mock("@/services/cookiesService", () => ({
  getCookies: vi.fn().mockReturnValue({
    firstName: "Alice",
    pictureUrl: "avatar.png",
  }),
  clearCookies: vi.fn(),
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

describe("RenameGroupDialog", () => {
  const onCloseMock = vi.fn();
  const webSocketRef = null; // satisfies WebSocketService | null
  const channelName = "Original Channel";
  const channelId = 1;
  const currentUserId = 1;
  const setCurrentChannelNameMock = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the dialog with current and new name inputs", () => {
    render(
      <RenameGroupDialog
        isOpen={true}
        onClose={onCloseMock}
        channelName={channelName}
        channelId={channelId}
        setCurrentChannelName={setCurrentChannelNameMock}
        currentUserId={currentUserId}
        webSocketRef={webSocketRef}
        cookies={mockCookies}
      />,
    );
    expect(screen.getByText("Rename Group")).toBeTruthy();
    const currentNameInput = screen.getByLabelText(
      "Current Name",
    ) as HTMLInputElement;
    expect(currentNameInput.disabled).toBe(true);
    expect(currentNameInput.value).toBe(channelName);
    expect(screen.getByLabelText("New Name")).toBeTruthy();
    const saveButton = screen.getByRole("button", {
      name: "Save",
    }) as HTMLButtonElement;
    expect(saveButton.disabled).toBe(true);
  });

  it("enables the Save button when a new name is entered", () => {
    render(
      <RenameGroupDialog
        isOpen={true}
        onClose={onCloseMock}
        channelName={channelName}
        channelId={channelId}
        setCurrentChannelName={setCurrentChannelNameMock}
        currentUserId={currentUserId}
        webSocketRef={webSocketRef}
        cookies={mockCookies}
      />,
    );
    const newNameInput = screen.getByLabelText("New Name");
    fireEvent.change(newNameInput, { target: { value: "New Channel" } });
    const saveButton = screen.getByRole("button", {
      name: "Save",
    }) as HTMLButtonElement;
    expect(saveButton.disabled).toBe(false);
  });

  it("calls renameChannel, sendDirectMessage, updates state, and calls onClose on successful save", async () => {
    renameChannelMock.mockResolvedValue({ status: 200 });
    sendDirectMessageMock.mockResolvedValue(undefined);
    render(
      <RenameGroupDialog
        isOpen={true}
        onClose={onCloseMock}
        channelName={channelName}
        channelId={channelId}
        setCurrentChannelName={setCurrentChannelNameMock}
        currentUserId={currentUserId}
        webSocketRef={webSocketRef}
        cookies={mockCookies}
      />,
    );
    const newNameInput = screen.getByLabelText("New Name");
    fireEvent.change(newNameInput, { target: { value: "New Channel" } });
    const saveButton = screen.getByRole("button", {
      name: "Save",
    }) as HTMLButtonElement;
    fireEvent.click(saveButton);
    await waitFor(() => {
      expect(renameChannelMock).toHaveBeenCalledWith({
        channelId,
        channelName: "New Channel",
      });
    });
    await waitFor(() => {
      expect(sendDirectMessageMock).toHaveBeenCalled();
    });
    await waitFor(() => {
      expect(setCurrentChannelNameMock).toHaveBeenCalledWith("New Channel");
    });
    await waitFor(() => {
      expect(onCloseMock).toHaveBeenCalled();
    });
  });

  it("calls onClose when Cancel button is clicked", () => {
    render(
      <RenameGroupDialog
        isOpen={true}
        onClose={onCloseMock}
        channelName={channelName}
        channelId={channelId}
        setCurrentChannelName={setCurrentChannelNameMock}
        currentUserId={currentUserId}
        webSocketRef={webSocketRef}
        cookies={mockCookies}
      />,
    );
    const cancelButton = screen.getByRole("button", { name: "Cancel" });
    fireEvent.click(cancelButton);
    expect(onCloseMock).toHaveBeenCalled();
  });
});
