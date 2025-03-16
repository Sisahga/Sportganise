import { render, screen } from "@testing-library/react";
import { test, expect, vi } from "vitest";
import HomeContent from "./HomeContent";
import { MemoryRouter as Router } from "react-router";

// Mock the modules that are imported by HomeContent
vi.mock("loglevel", () => ({
  default: {
    info: vi.fn(),
  },
}));

vi.mock("../ViewTrainingSessions", () => ({
  TrainingSessionsList: () => <div>Mock Training Sessions List</div>,
}));

vi.mock("@/services/cookiesService", () => ({
  getCookies: () => ({ type: "user" }),
  getAccountIdCookie: () => 1,
}));

vi.mock("@/hooks/usePersonalInfromation", () => ({
  default: () => ({
    data: { firstName: "TestUser" },
    loading: false,
    error: null,
  }),
}));

test("renders the welcome message", async () => {
  // Mock IntersectionObserver
  const MockIntersectionObserver = vi.fn(() => ({
    disconnect: vi.fn(),
    observe: vi.fn(),
    takeRecords: vi.fn(),
    unobserve: vi.fn(),
  }));
  vi.stubGlobal("IntersectionObserver", MockIntersectionObserver);
  
  render(
    <Router>
      <HomeContent />
    </Router>
  );
  
  // Use a more specific text match to find the welcome message
  const welcomeMessage = screen.getByText(/Hello TestUser/i);
  expect(welcomeMessage.parentNode).not.toBeNull();
});