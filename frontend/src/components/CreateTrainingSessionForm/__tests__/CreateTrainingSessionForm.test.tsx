import { render } from "@testing-library/react";
//import { screen } from "@testing-library/react";
import { HomeContent } from "@/components/HomeContent";
import { MemoryRouter as Router } from "react-router";
import { vi } from "vitest";

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
  //TO DO, complete these tests
  //const welcomeMessage = screen.getByText("Hello");
  //expect(welcomeMessage.parentNode).not.toBeNull();
});
