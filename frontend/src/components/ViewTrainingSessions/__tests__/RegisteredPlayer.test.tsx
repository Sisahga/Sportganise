import { render, screen } from "@testing-library/react";
import { test, expect, vi } from "vitest";
import RegisteredPlayer from "../RegisteredPlayer";

test("displays loading", () => {
  const mock = vi.fn();
  mock.mockReturnValue({
    data: null,
    loading: true,
    error: null,
  });
  render(<RegisteredPlayer accountId={1} />);
  const loading = screen.getByText("Loading...");
  expect(document.body.contains(loading)).toBe(true);
});
