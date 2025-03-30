import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import ChangeForgottenPasswordPage from "./ResetPassword";

vi.mock("@/components/ResetPasswordContent", () => ({
  ChangeForgottenPasswordContent: () => (
    <div>ChangeForgottenPasswordContent</div>
  ),
}));

describe("ChangeForgottenPasswordPage", () => {
  it("renders ChangeForgottenPasswordContent", () => {
    render(<ChangeForgottenPasswordPage />);
    expect(
      screen.getByText("ChangeForgottenPasswordContent"),
    ).toBeInTheDocument();
  });
});
