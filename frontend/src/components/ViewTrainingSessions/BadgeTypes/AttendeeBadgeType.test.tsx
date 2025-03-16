import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import "@testing-library/jest-dom";

vi.mock("../../ui/badge", () => ({
  Badge: ({
    variant,
    className,
    children,
  }: {
    variant?: string;
    className?: string;
    children: React.ReactNode;
  }) => (
    <span data-variant={variant} className={className}>
      {children}
    </span>
  ),
}));

import AttendeeBadgeType from "./AttendeeBadgeType"; // Adjust the import path as needed
import { AccountType } from "@/types/account";

describe("AttendeeBadgeType component", () => {
  it("renders a destructive badge when accountType is undefined", () => {
    render(<AttendeeBadgeType />);
    const badge = screen.getByText(/no type/i);
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveAttribute("data-variant", "destructive");
  });

  it("renders an outline badge for ADMIN account type", () => {
    render(<AttendeeBadgeType accountType="ADMIN" />);
    const badge = screen.getByText(/admin/i);
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveAttribute("data-variant", "outline");
  });

  it("renders a secondary badge for COACH account type", () => {
    render(<AttendeeBadgeType accountType="COACH" />);
    const badge = screen.getByText(/coach/i);
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveAttribute("data-variant", "secondary");
  });

  it("renders a default badge for PLAYER account type", () => {
    render(<AttendeeBadgeType accountType="PLAYER" />);
    const badge = screen.getByText(/player/i);
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveAttribute("data-variant", "default");
  });

  it("renders a default badge for GENERAL account type", () => {
    render(<AttendeeBadgeType accountType="GENERAL" />);
    const badge = screen.getByText(/general/i);
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveAttribute("data-variant", "default");
  });

  it("renders a badge with a custom class for unknown account types", () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    render(
      <AttendeeBadgeType accountType={"UNKNOWN" as unknown as AccountType} />,
    );

    const badge = screen.getByText(/unknown/i);
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass("bg-amber-400");
  });
});
