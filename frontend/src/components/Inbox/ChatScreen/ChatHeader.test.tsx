import { describe, it, expect, beforeEach, vi, MockedFunction } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";

vi.mock("react-router", async () => {
  const actual = await vi.importActual("react-router");
  return {
    ...actual,
    useNavigate: vi.fn(),
  };
});

import { useNavigate } from "react-router";
import ChatHeader from "./ChatHeader";

type UseNavigateMock = MockedFunction<typeof useNavigate>;

describe("ChatHeader", () => {
  const mockNavigate = vi.fn();
  const mockOnDeleteChat = vi.fn();
  const mockOnBlockUser = vi.fn();

  const defaultProps = {
    chatName: "Test Chat",
    chatAvatar: "test-avatar.jpg",
    channelId: 123,
    onDeleteChat: mockOnDeleteChat,
    onBlockUser: mockOnBlockUser,
  };

  beforeEach(() => {
    mockNavigate.mockClear();
    mockOnDeleteChat.mockClear();
    mockOnBlockUser.mockClear();
    (useNavigate as UseNavigateMock).mockReturnValue(mockNavigate);
  });

  it("renders chat name and avatar", () => {
    render(<ChatHeader {...defaultProps} />);
    expect(screen.getByText("Test Chat")).toBeInTheDocument();
    const avatarImg = screen.getByRole("img", {
      name: /test chat/i,
    }) as HTMLImageElement;
    expect(avatarImg).toBeInTheDocument();
    expect(avatarImg.src).toContain("test-avatar.jpg");
  });

  it("navigates back when the back button is clicked", () => {
    render(<ChatHeader {...defaultProps} />);
    const backButton = screen.getByRole("button", { name: /back/i });
    fireEvent.click(backButton);
    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });

  it("toggles the 3-dot options menu when clicked", () => {
    render(<ChatHeader {...defaultProps} />);
    const optionsButton = screen.getByRole("button", { name: /options/i });
    expect(screen.queryByText(/delete chat/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/block user/i)).not.toBeInTheDocument();
    fireEvent.click(optionsButton);
    expect(screen.getByText(/delete chat/i)).toBeInTheDocument();
    expect(screen.getByText(/block user/i)).toBeInTheDocument();
    fireEvent.click(optionsButton);
    expect(screen.queryByText(/delete chat/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/block user/i)).not.toBeInTheDocument();
  });

  it('calls onDeleteChat with the channelId when "Delete Chat" is clicked', () => {
    render(<ChatHeader {...defaultProps} />);
    const optionsButton = screen.getByRole("button", { name: /options/i });
    fireEvent.click(optionsButton);
    const deleteButton = screen.getByText(/delete chat/i);
    fireEvent.click(deleteButton);
    expect(mockOnDeleteChat).toHaveBeenCalledWith(123);
  });

  it('calls onBlockUser when "Block User" is clicked', () => {
    render(<ChatHeader {...defaultProps} />);
    const optionsButton = screen.getByRole("button", { name: /options/i });
    fireEvent.click(optionsButton);
    const blockButton = screen.getByText(/block user/i);
    fireEvent.click(blockButton);
    expect(mockOnBlockUser).toHaveBeenCalledTimes(1);
  });
});
