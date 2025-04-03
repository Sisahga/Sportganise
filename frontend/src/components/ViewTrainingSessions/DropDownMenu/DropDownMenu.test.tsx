import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import "@testing-library/jest-dom";

// Mock useNavigate from react-router
vi.mock("react-router", () => ({
  useNavigate: () => vi.fn(),
}));

// Mock hooks
vi.mock("@/hooks/useAbsent", () => ({
  default: () => ({ markAbsent: vi.fn(), error: null }),
}));

// Mock DropdownMenu components
vi.mock("@/components/ui/dropdown-menu", () => ({
  DropdownMenu: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  DropdownMenuTrigger: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  DropdownMenuContent: ({
    children,
    className,
  }: {
    children: React.ReactNode;
    className?: string;
  }) => (
    <div data-testid="dropdown-menu-content" className={className}>
      {children}
    </div>
  ),
  DropdownMenuGroup: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  DropdownMenuItem: ({
    children,
    onSelect,
    onClick,
  }: {
    children: React.ReactNode;
    onSelect?: () => void;
    onClick?: () => void;
  }) => (
    <button onClick={onSelect || onClick} data-testid="dropdown-menu-item">
      {children}
    </button>
  ),
  DropdownMenuLabel: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  DropdownMenuSeparator: () => <div />,
}));

// Mock AlertDialog components
vi.mock("@/components/ui/alert-dialog", () => ({
  AlertDialog: ({
    children,
    open,
  }: {
    children: React.ReactNode;
    open: boolean;
    onOpenChange?: (open: boolean) => void;
  }) => <div data-testid="alert-dialog">{open ? children : null}</div>,
  AlertDialogContent: ({
    children,
    className,
  }: {
    children: React.ReactNode;
    className?: string;
  }) => <div className={className}>{children}</div>,
  AlertDialogHeader: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  AlertDialogTitle: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  AlertDialogDescription: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  AlertDialogFooter: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  AlertDialogCancel: ({
    children,
    onClick,
  }: {
    children: React.ReactNode;
    onClick?: () => void;
  }) => <button onClick={onClick}>{children}</button>,
  AlertDialogAction: ({
    children,
    onClick,
  }: {
    children: React.ReactNode;
    onClick?: () => void;
  }) => <button onClick={onClick}>{children}</button>,
}));

// Import the component to test
import DropDownMenuButton from "./DropDownMenuButton";
import { ProgramDetails, Attendees } from "@/types/trainingSessionDetails";
import { CookiesDto } from "@/types/auth";

// Provide minimal valid test data
const programDetails: ProgramDetails = {
  programId: "123",
} as unknown as ProgramDetails;

const attendees: Attendees[] = [];

// Create dummy user objects that fully satisfy CookiesDto.
// const coachUser: CookiesDto = {
//   accountId: 123,
//   firstName: "Coach",
//   lastName: "User",
//   email: "coach@example.com",
//   pictureUrl: "http://example.com/coach.png",
//   type: "coach",
//   phone: "1234567890",
//   organisationIds: [1, 2],
//   jwtToken: "dummyJwtToken",
// };

// const playerUser: CookiesDto = {
//   accountId: 456,
//   firstName: "Player",
//   lastName: "User",
//   email: "player@example.com",
//   pictureUrl: "http://example.com/player.png",
//   type: "player",
//   phone: "0987654321",
//   organisationIds: [1],
//   jwtToken: "dummyJwtToken",
// };

// Optionally provide an accountAttendee if needed (for now, undefined)
// const accountAttendee: Attendees | undefined = undefined;

describe.skip("DropDownMenuButton component", () => {
  it("renders coach/admin options when user type is 'coach'", () => {
    const user: CookiesDto = {
      accountId: "12345",
      type: "coach",
    } as unknown as CookiesDto;

    render(
      <DropDownMenuButton
        user={user}
        accountAttendee={undefined}
        programDetails={programDetails}
        attendees={attendees}
        onRefresh={vi.fn()}
      />
    );

    // Verify the trigger button is rendered
    const triggerButton = screen.getByLabelText("Add new item");
    expect(triggerButton).toBeInTheDocument();

    // Simulate clicking the trigger button to reveal the dropdown content
    fireEvent.click(triggerButton);

    // Check that dropdown content contains coach/admin options
    expect(screen.getByText(/Edit Event/i)).toBeInTheDocument();
    expect(screen.getByText(/Postpone Event/i)).toBeInTheDocument();
    expect(screen.getByText(/Delete Event/i)).toBeInTheDocument();
  });

  it("renders RSVP when player has not confirmed", () => {
    const user: CookiesDto = {
      accountId: "12345",
      type: "player",
    } as unknown as CookiesDto;

    const accountAttendee: Attendees = {
      accountId: 12345,
      programId: 98765,
      participantType: "Subscribed",
      confirmed: false,
      confirmedDate: null,
      rank: null,
    };

    render(
      <DropDownMenuButton
        user={user}
        accountAttendee={accountAttendee}
        programDetails={programDetails}
        attendees={attendees}
        onRefresh={vi.fn()}
      />
    );

    fireEvent.click(screen.getByLabelText("Add new item"));

    expect(screen.getByText(/RSVP/i)).toBeInTheDocument();
    expect(screen.queryByText(/Mark absent/i)).not.toBeInTheDocument(); // optional
  });

  it("renders 'Mark absent' when player is already confirmed", () => {
    const user: CookiesDto = {
      accountId: "12345",
      type: "player",
    } as unknown as CookiesDto;

    const accountAttendee: Attendees = {
      accountId: 12345,
      programId: 98765,
      participantType: "Subscribed",
      confirmed: true,
      confirmedDate: null,
      rank: null,
    };

    render(
      <DropDownMenuButton
        user={user}
        accountAttendee={accountAttendee}
        programDetails={programDetails}
        attendees={attendees}
        onRefresh={vi.fn()}
      />
    );

    fireEvent.click(screen.getByLabelText("Add new item"));

    expect(screen.getByText(/Mark absent/i)).toBeInTheDocument();
    expect(screen.queryByText(/RSVP/i)).not.toBeInTheDocument(); // optional
  });

  it("renders non-coach options when user type is 'player'", () => {
    const user: CookiesDto = {
      accountId: "12345",
      type: "player",
    } as unknown as CookiesDto;

    const accountAttendee: Attendees = {
      accountId: 12345,
      programId: 98765,
      participantType: "Subscribed",
      confirmed: false,
      confirmedDate: null,
      rank: null,
    };

    render(
      <DropDownMenuButton
        user={user}
        accountAttendee={accountAttendee}
        programDetails={programDetails}
        attendees={attendees}
        onRefresh={vi.fn()}
      />
    );

    // Verify the trigger button is rendered
    const triggerButton = screen.getByLabelText("Add new item");
    expect(triggerButton).toBeInTheDocument();

    // Simulate clicking the trigger button to reveal the dropdown content
    fireEvent.click(triggerButton);

    // Check that dropdown content contains non-coach options
    expect(screen.getByText(/RSVP/i)).toBeInTheDocument();
    expect(screen.getByText(/Mark absent/i)).toBeInTheDocument();
  });

  it("handles postpone event flow for coach/admin", async () => {
    const user: CookiesDto = {
      accountId: "12345",
      type: "coach",
    } as unknown as CookiesDto;

    render(
      <DropDownMenuButton
        user={user}
        accountAttendee={undefined}
        programDetails={programDetails}
        attendees={attendees}
        onRefresh={vi.fn()}
      />
    );

    // Open the dropdown and click on the 'Postpone Event' item.
    const triggerButton = screen.getByLabelText("Add new item");
    fireEvent.click(triggerButton);
    const postponeButton = screen.getByText(/Postpone Event/i);
    fireEvent.click(postponeButton);

    // Verify that the postpone alert dialog is rendered
    const postponeDialogTitle = await screen.findByText(
      /Would you like to postpone this event\?/i
    );
    expect(postponeDialogTitle).toBeInTheDocument();

    // Simulate clicking confirm within the dialog
    const confirmButton = screen.getByText(/Confirm/i);
    fireEvent.click(confirmButton);

    // Check that the postpone confirmation message appears
    const confirmationMessage = await screen.findByText(
      /You have successfully postponed the event/i
    );
    expect(confirmationMessage).toBeInTheDocument();
  });

  it("handles RSVP flow for non-coach", async () => {
    const user: CookiesDto = {
      accountId: "12345",
      type: "player",
    } as unknown as CookiesDto;

    const accountAttendee: Attendees = {
      accountId: 12345,
      programId: 999,
      participantType: "Subscribed",
      confirmed: false,
      confirmedDate: null,
      rank: null,
    };

    render(
      <DropDownMenuButton
        user={user}
        accountAttendee={accountAttendee}
        programDetails={programDetails}
        attendees={attendees}
        onRefresh={vi.fn()}
      />
    );

    // Open the dropdown and click on the 'RSVP' item.
    const triggerButton = screen.getByLabelText("Add new item");
    fireEvent.click(triggerButton);
    const rsvpButton = screen.getByText(/RSVP/i);
    fireEvent.click(rsvpButton);

    // Verify that the RSVP alert dialog is rendered
    const rsvpDialogTitle = await screen.findByText(
      /Would you like to confirm your presence\?/i
    );
    expect(rsvpDialogTitle).toBeInTheDocument();

    // Simulate clicking confirm within the dialog
    const confirmButton = screen.getByRole("button", { name: /Confirm/i });
    fireEvent.click(confirmButton);

    // Check that the RSVP confirmation message appears
    const confirmationMessage = await screen.findByText(
      /Your presence is noted/i
    );
    expect(confirmationMessage).toBeInTheDocument();
  });
});
