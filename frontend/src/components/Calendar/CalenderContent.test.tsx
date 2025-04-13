import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import CalendarContent from "./CalendarContent";

// Mock the Calendar component
vi.mock("../ui/calendar", () => ({
  Calendar: () => <div data-testid="calendar-component">Calendar</div>,
}));

// Mock the TrainingSessionsList component
vi.mock("../ViewTrainingSessions", () => ({
  TrainingSessionsList: () => (
    <div data-testid="training-sessions-list">Training Sessions List</div>
  ),
}));

describe("CalendarContent", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });

  it("renders the Schedule heading", () => {
    render(<CalendarContent />);
    const heading = screen.getByRole("heading", { name: /schedule/i });
    expect(heading).toBeInTheDocument();
  });

  it("renders the Calendar component", () => {
    render(<CalendarContent />);
    const calendarComponent = screen.getByTestId("calendar-component");
    expect(calendarComponent).toBeInTheDocument();
  });

  it.skip("renders the horizontal rule", () => {
    render(<CalendarContent />);
    // <hr> elements typically have the role "separator"
    const hrElement = screen.getByRole("separator");
    expect(hrElement).toBeInTheDocument();
  });

  it("renders the TrainingSessionsList component", () => {
    render(<CalendarContent />);
    const trainingSessionsList = screen.getByTestId("training-sessions-list");
    expect(trainingSessionsList).toBeInTheDocument();
  });
});
