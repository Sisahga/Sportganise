import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import NotificationSettingsPage from "./NotificationSettingsPage";

vi.mock("@/components/AccountSettingsContent", () => ({
  NotificationSettings: () => <div>NotificationSettings</div>,
}));

describe("NotificationSettingsPage", () => {
  it("renders NotificationSettings", () => {
    render(<NotificationSettingsPage />);
    expect(screen.getByText("NotificationSettings")).toBeInTheDocument();
  });
});
