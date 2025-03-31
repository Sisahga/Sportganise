import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import HomePage from "./HomePage";

vi.mock("@/components/HeaderNav", () => ({
  HeaderNav: () => <div>HeaderNav</div>,
}));

vi.mock("@/components/HomeContent", () => ({
  HomeContent: () => <div>HomeContent</div>,
}));

vi.mock("@/components/FooterNav", () => ({
  FooterNav: () => <div>FooterNav</div>,
}));

describe("HomePage", () => {
  it("renders HeaderNav, HomeContent, and FooterNav", () => {
    render(<HomePage />);
    expect(screen.getByText("HeaderNav")).toBeInTheDocument();
    expect(screen.getByText("HomeContent")).toBeInTheDocument();
    expect(screen.getByText("FooterNav")).toBeInTheDocument();
  });
});
