import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import ChangePasswordPage from "./ChangePasswordPage";

vi.mock("@/components/ChangePasswordContent", () => ({
  ChangePasswordContent: () => <div>ChangePasswordContent</div>,
}));

describe("ChangePasswordPage", () => {
  it("renders ChangePasswordContent", () => {
    render(<ChangePasswordPage />);
    expect(screen.getByText("ChangePasswordContent")).toBeInTheDocument();
  });
});
