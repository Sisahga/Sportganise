import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import ViewTrainingSessionPage from "./ViewTrainingSessionPage";

vi.mock("@/components/ViewTrainingSessions", () => ({
  TrainingSessionContent: () => <div>TrainingSessionContent</div>,
}));

describe("ViewTrainingSessionPage", () => {
  it("renders TrainingSessionContent", () => {
    render(<ViewTrainingSessionPage />);
    expect(screen.getByText("TrainingSessionContent")).toBeInTheDocument();
  });
});
