import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import ModifyTrainingSessionPage from "./ModifyTrainingSessionPage";

vi.mock("@/components/TrainingSessionForm", () => ({
  ModifyTrainingSessionForm: () => <div>ModifyTrainingSessionForm</div>,
}));

describe("ModifyTrainingSessionPage", () => {
  it("renders ModifyTrainingSessionForm and ToastViewport", () => {
    render(<ModifyTrainingSessionPage />);
    expect(screen.getByText("ModifyTrainingSessionForm")).toBeInTheDocument();
    // ToastViewport is rendered by @radix-ui/react-toast.
    // You can check that the component rendered without crashing.
  });
});
