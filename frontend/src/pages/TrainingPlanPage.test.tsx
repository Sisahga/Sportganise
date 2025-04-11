import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import TrainingPlanPage from "./TrainingPlanPage";

vi.mock("@/components/TrainingPlan", () => ({
  TrainingPlanContent: () => <div>TrainingPlanContent</div>,
}));

describe("TrainingPlanPage", () => {
  it("renders TrainingPlanContent", () => {
    render(<TrainingPlanPage />);
    expect(screen.getByText("TrainingPlanContent")).toBeInTheDocument();
  });
});
