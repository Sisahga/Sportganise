import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import ForgotPasswordPage from "./ForgotPasswordPage";

vi.mock("@/components/SecondaryHeader", () => ({
  SecondaryHeader: () => <div>SecondaryHeader</div>,
}));

vi.mock("../components/ForgotPassword/index", () => ({
  ForgotPassword: () => <div>ForgotPassword</div>,
}));

describe("ForgotPasswordPage", () => {
  it("renders SecondaryHeader and ForgotPassword components", () => {
    render(<ForgotPasswordPage />);
    expect(screen.getByText("SecondaryHeader")).toBeInTheDocument();
    expect(screen.getByText("ForgotPassword")).toBeInTheDocument();
  });
});
