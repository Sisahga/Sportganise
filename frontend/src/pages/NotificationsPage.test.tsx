import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import NotificationsPage from "./NotificationsPage";

vi.mock("@/components/NotificationContent", () => ({
  NotificationContent: () => <div>NotificationContent</div>,
}));

describe("NotificationsPage", () => {
  it("renders NotificationContent", () => {
    render(<NotificationsPage />);
    expect(screen.getByText("NotificationContent")).toBeInTheDocument();
  });
});
