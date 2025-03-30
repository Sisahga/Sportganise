import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import CreateTrainingSessionPage from "./CreateTrainingSessionPage";

vi.mock("@/components/CreateTrainingSessionForm", () => ({
  CreateTrainingSessionForm: () => <div>CreateTrainingSessionForm</div>,
}));

describe("CreateTrainingSessionPage", () => {
  it("renders CreateTrainingSessionForm component", () => {
    render(<CreateTrainingSessionPage />);
    expect(screen.getByText("CreateTrainingSessionForm")).toBeInTheDocument();
  });
});
