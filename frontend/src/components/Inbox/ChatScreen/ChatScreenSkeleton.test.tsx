import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import ChatScreenSkeleton from "./ChatScreenSkeleton";

describe("ChatScreenSkeleton", () => {
  it("renders without crashing and displays key elements", () => {
    render(<ChatScreenSkeleton />);
    expect(screen.getByRole("button", { name: /back/i })).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/send a message/i)).toBeInTheDocument();
    const sendButton = screen.getByRole("button", { name: /send/i });
    expect(sendButton).toBeDisabled();
  });

  it("renders skeleton elements", () => {
    render(<ChatScreenSkeleton />);
    const skeletonElements = document.querySelectorAll(".animate-skeleton");
    expect(skeletonElements.length).toBeGreaterThan(0);
  });
});
