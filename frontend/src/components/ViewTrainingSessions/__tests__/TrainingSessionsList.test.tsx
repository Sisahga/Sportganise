import { render, screen } from "@testing-library/react";
import { test, expect, vi } from "vitest";
import TrainingSessionsList from "../TrainingSessionsList";

test("renders Upcoming Programs", () => {
  render(<TrainingSessionsList />);
  const p = screen.getByText("Upcoming Programs");
  expect(document.body.contains(p)).toBe(true);
});

test("renders filter button", () => {
  render(<TrainingSessionsList />);
  const filter = screen.getByRole("button");
  expect(document.body.contains(filter)).toBe(true);
});

vi.mock("@/hooks/usePrograms", () => ({
  usePrograms: vi.fn(() => ({
    programs: [],
    error: true,
    loading: false,
  })),
}));

test("renders error when error is true", () => {
  render(<TrainingSessionsList />);
  const error = screen.getByRole("paragraph");
  expect(document.body.contains(error)).toBe(true);
});

vi.mock("@/hooks/usePrograms", () => ({
  usePrograms: vi.fn(() => ({
    programs: [],
    error: false,
    loading: true,
  })),
}));

test("renders loader when loading is true", () => {
  render(<TrainingSessionsList />);
  const loading = screen.getByRole("paragraph");
  expect(document.body.contains(loading)).toBe(true);
});
