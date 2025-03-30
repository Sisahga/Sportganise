import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import VerificationCodePage from "./VerificationCodePage";

vi.mock("../components/VerificationCode/index", () => ({
  VerificationCode: () => <div>VerificationCode</div>,
}));

describe("VerificationCodePage", () => {
  it("renders VerificationCode", () => {
    render(<VerificationCodePage />);
    expect(screen.getByText("VerificationCode")).toBeInTheDocument();
  });
});
