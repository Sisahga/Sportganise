import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import CalendarPage from "./CalendarPage";

vi.mock("@/components/Calendar", () => ({
  CalendarContent: () => <div>CalendarContent</div>,
}));

describe("CalendarPage", () => {
  it("renders CalendarContent", () => {
    render(<CalendarPage />);
    expect(screen.getByText("CalendarContent")).toBeInTheDocument();
  });
});
