// src/components/Inbox/ChatScreen/ChatHeader.test.tsx

import React from 'react';
import { describe, it, expect, beforeEach, vi, MockedFunction } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

// ---------------------------------------------------------------------------
// 1) Mock react-router-dom with esModule: true
// ---------------------------------------------------------------------------
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: vi.fn(),
  };
});

// ---------------------------------------------------------------------------
// Now import the modules we just mocked
// ---------------------------------------------------------------------------
import { useNavigate } from 'react-router-dom';
import ChatHeader from './ChatHeader';

// ---------------------------------------------------------------------------
// Create typed aliases for our mocked functions
// ---------------------------------------------------------------------------
type UseNavigateMock = MockedFunction<typeof useNavigate>;

describe('ChatHeader', () => {
  const mockNavigate = vi.fn();
  const mockOnDeleteChat = vi.fn();
  const mockOnBlockUser = vi.fn();

  const defaultProps = {
    chatName: 'Test Chat',
    chatAvatar: 'test-avatar.jpg',
    channelId: 123,
    onDeleteChat: mockOnDeleteChat,
    onBlockUser: mockOnBlockUser,
  };

  beforeEach(() => {
    // Reset mocks before each test
    mockNavigate.mockClear();
    mockOnDeleteChat.mockClear();
    mockOnBlockUser.mockClear();

    // Type cast useNavigate as a MockedFunction to call .mockReturnValue
    (useNavigate as UseNavigateMock).mockReturnValue(mockNavigate);
  });

  // -------------------------------------------------------------------------
  // 1) Renders chat name and avatar
  // -------------------------------------------------------------------------
  it('renders chat name and avatar', () => {
    render(<ChatHeader {...defaultProps} />);
    // Check that the chat name is rendered
    expect(screen.getByText('Test Chat')).toBeInTheDocument();

    // Check that the avatar is displayed with correct alt text
    const avatarImg = screen.getByRole('img', { name: /test chat/i }) as HTMLImageElement;
    expect(avatarImg).toBeInTheDocument();
    expect(avatarImg.src).toContain('test-avatar.jpg');
  });

  // -------------------------------------------------------------------------
  // 2) Navigation back
  // -------------------------------------------------------------------------
  it('navigates back when the back button is clicked', () => {
    render(<ChatHeader {...defaultProps} />);
    // Locate the back button using aria-label
    const backButton = screen.getByRole('button', { name: /back/i });
    fireEvent.click(backButton);

    // Expect navigate(-1) to have been called
    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });

  // -------------------------------------------------------------------------
  // 3) Toggles the 3-dot options menu when clicked
  // -------------------------------------------------------------------------
  it('toggles the 3-dot options menu when clicked', () => {
    render(<ChatHeader {...defaultProps} />);

    // Locate the options button using aria-label
    const optionsButton = screen.getByRole('button', { name: /options/i });

    // Initially, Delete Chat and Block User options should not be visible
    expect(screen.queryByText(/delete chat/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/block user/i)).not.toBeInTheDocument();

    // Click to open the menu
    fireEvent.click(optionsButton);
    expect(screen.getByText(/delete chat/i)).toBeInTheDocument();
    expect(screen.getByText(/block user/i)).toBeInTheDocument();

    // Click again to close the menu
    fireEvent.click(optionsButton);
    expect(screen.queryByText(/delete chat/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/block user/i)).not.toBeInTheDocument();
  });

  // -------------------------------------------------------------------------
  // 4) Calls onDeleteChat with the channelId when "Delete Chat" is clicked
  // -------------------------------------------------------------------------
  it('calls onDeleteChat with the channelId when "Delete Chat" is clicked', () => {
    render(<ChatHeader {...defaultProps} />);

    // Open the options menu
    const optionsButton = screen.getByRole('button', { name: /options/i });
    fireEvent.click(optionsButton);

    // Click the "Delete Chat" button
    const deleteButton = screen.getByText(/delete chat/i);
    fireEvent.click(deleteButton);

    // Expect onDeleteChat to have been called with the correct channelId
    expect(mockOnDeleteChat).toHaveBeenCalledWith(123);
  });

  // -------------------------------------------------------------------------
  // 5) Calls onBlockUser when "Block User" is clicked
  // -------------------------------------------------------------------------
  it('calls onBlockUser when "Block User" is clicked', () => {
    render(<ChatHeader {...defaultProps} />);

    // Open the options menu
    const optionsButton = screen.getByRole('button', { name: /options/i });
    fireEvent.click(optionsButton);

    // Click the "Block User" button
    const blockButton = screen.getByText(/block user/i);
    fireEvent.click(blockButton);

    // Expect onBlockUser to have been called once
    expect(mockOnBlockUser).toHaveBeenCalledTimes(1);
  });
});
