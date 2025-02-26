import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import NotificationsPage from "./NotificationContent";
import { describe, it, expect } from "vitest";

describe("NotificationsPage", () => {
  it("renders the notifications header and shows the unread count", () => {
    render(<NotificationsPage />);
    expect(screen.getByText("Notifications")).toBeTruthy();
    expect(screen.getByText(/You have 3 unread notifications/i)).toBeTruthy();
  });

  it("renders both unread and read notifications", () => {
    render(<NotificationsPage />);
    expect(screen.getByText("Coach Smith")).toBeTruthy();
    expect(screen.getByText("Team Captain")).toBeTruthy();
    expect(screen.getByText("League Organizer")).toBeTruthy();
    expect(screen.getByText("Tournament Committee")).toBeTruthy();
    expect(screen.getByText("Team Manager")).toBeTruthy();
  });

  it("marks all notifications as read when 'Mark all as read' button is clicked", async () => {
    render(<NotificationsPage />);
    const markAllButton = screen.getByRole("button", {
      name: /Mark all as read/i,
    });
    expect(markAllButton).toBeTruthy();
    fireEvent.click(markAllButton);
    await waitFor(() => {
      expect(screen.getByText(/You have 0 unread notifications/i)).toBeTruthy();
      expect(
        screen.queryByRole("button", { name: /Mark all as read/i }),
      ).toBeNull();
    });
  });
});
