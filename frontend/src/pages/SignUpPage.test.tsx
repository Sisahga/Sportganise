import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import SignUpPage from "./SignUpPage";

vi.mock("../components/SignUp/index", () => ({
  SignUp: () => <div>SignUp</div>,
}));

describe("SignUpPage", () => {
  it("renders SignUp component", () => {
    render(<SignUpPage />);
    expect(screen.getByText("SignUp")).toBeInTheDocument();
  });
});
