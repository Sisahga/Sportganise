import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import LogInPage from "./LogInPage";

vi.mock("../components/LogIn/index", () => ({
  LogIn: () => <div>LogIn</div>,
}));

describe("LogInPage", () => {
  it("renders the LogIn component", () => {
    render(<LogInPage />);
    expect(screen.getByText("LogIn")).toBeInTheDocument();
  });
});
