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

import EventBadgeType from "./EventBadgeType"; // Adjust the import path as needed

describe("EventBadgeType component", () => {
  it("renders a badge for training with default styling", () => {
    render(<EventBadgeType programType="training" />);
    const badge = screen.getByText(/training/i);
    expect(badge).toBeInTheDocument();
    // For "training", no variant or className is provided so data-variant should be null.
    expect(badge.getAttribute("data-variant")).toBeNull();
  });

  it("renders a secondary badge for fundraisor", () => {
    render(<EventBadgeType programType="fundraisor" />);
    const badge = screen.getByText(/fundraisor/i);
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveAttribute("data-variant", "secondary");
  });

  it("renders a secondary badge for fundraiser", () => {
    render(<EventBadgeType programType="fundraiser" />);
    const badge = screen.getByText(/fundraiser/i);
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveAttribute("data-variant", "secondary");
  });

  it("renders a badge with custom class for tournament", () => {
    render(<EventBadgeType programType="tournament" />);
    const badge = screen.getByText(/tournament/i);
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass("bg-teal-400");
  });

  it("renders a badge with custom class for inter-club meeting", () => {
    render(<EventBadgeType programType="inter-club meeting" />);
    const badge = screen.getByText(/inter-club meeting/i);
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass("bg-indigo-300");
  });

  it("renders a badge with custom class for special training", () => {
    render(<EventBadgeType programType="special training" />);
    const badge = screen.getByText(/special training/i);
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass("bg-slate-400");
  });

  it("renders a destructive badge for cancelled", () => {
    render(<EventBadgeType programType="cancelled" />);
    const badge = screen.getByText(/cancelled/i);
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveAttribute("data-variant", "destructive");
  });

  it("renders an outline badge for unknown program types", () => {
    render(<EventBadgeType programType="unknown" />);
    const badge = screen.getByText(/unknown/i);
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveAttribute("data-variant", "outline");
  });
});
