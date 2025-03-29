import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import WaitlistTrainingSession from "./WaitlistTrainingSession";
import { Program } from "@/types/trainingSessionDetails";

interface WaitlistedTrainingSessionListProps {
  onSelectTraining: (program: Program) => void;
}

vi.mock("./WaitlistedTrainingSessionList", () => ({
  default: (props: WaitlistedTrainingSessionListProps) => (
    <div data-testid="waitlist-session-list">
      {typeof props.onSelectTraining === "function"
        ? "has onSelectTraining"
        : "no onSelectTraining"}
    </div>
  ),
}));

describe("WaitlistTrainingSession", () => {
  const onSelectTrainingMock = vi.fn();

  it("renders header and description", () => {
    render(<WaitlistTrainingSession onSelectTraining={onSelectTrainingMock} />);
    expect(screen.getByText("Waitlisted Players")).toBeInTheDocument();
    expect(
      screen.getByText(
        "The training sessions below are available for waitlisted members only.",
      ),
    ).toBeInTheDocument();
  });

  it("renders WaitlistedTrainingSessionList with onSelectTraining prop", () => {
    render(<WaitlistTrainingSession onSelectTraining={onSelectTrainingMock} />);
    const child = screen.getByTestId("waitlist-session-list");
    expect(child).toHaveTextContent("has onSelectTraining");
  });
});
