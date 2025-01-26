import { render, screen } from "@testing-library/react";
import { test, expect, vi } from "vitest";
import HomeContent from "./HomeContent";
import { MemoryRouter as Router } from "react-router";

test("renders the welcome message", () => {
  const MockIntersectionObserver = vi.fn(() => ({
    disconnect: vi.fn(),
    observe: vi.fn(),
    takeRecords: vi.fn(),
    unobserve: vi.fn(),
  }));
  vi.stubGlobal(`IntersectionObserver`, MockIntersectionObserver);
  render(
    <Router>
      <HomeContent />
    </Router>,
  );
  const welcomeMessage = screen.getByText("Welcome to ONIBAD!");
  expect(welcomeMessage.parentNode).not.toBeNull();
});
