import { render, screen } from "@testing-library/react";
import { test, expect, vi } from "vitest";
import { MemoryRouter } from "react-router";
import RegisteredPlayer from "../RegisteredPlayer";
import "@testing-library/jest-dom";

// Mock the usePersonalInformation hook
vi.mock("@/hooks/usePersonalInformation", () => ({
  usePersonalInformation: vi.fn().mockReturnValue({
    data: null,
    loading: true,
    error: null,
  }),
}));

test("displays loading", () => {
  render(
    <MemoryRouter>
      <RegisteredPlayer accountId={1} />
    </MemoryRouter>,
  );

  // Check if "Loading..." text is present
  const loading = screen.getByText("Loading...");
  expect(loading).toBeInTheDocument();
});
