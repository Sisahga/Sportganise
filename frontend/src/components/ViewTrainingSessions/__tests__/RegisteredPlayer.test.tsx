import { render, screen, renderHook } from "@testing-library/react";
import { test, expect, vi } from "vitest";
import RegisteredPlayer from "../RegisteredPlayer";
import usePersonalInformation from "@/hooks/usePersonalInfromation";

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

test("displays error", () => {
  const mock = vi.fn();
  mock.mockReturnValue({
    data: null,
    loading: false,
    error: "display error",
  });
  render(<RegisteredPlayer accountId={1} />);
  const error = screen.getByText("Failed to load account details");
  expect(document.body.contains(error)).toBe(true);
});

test("displays personal info", () => {
  const mock = vi.fn();
  mock.mockReturnValue({
    data: {
      accountId: 1,
      type: "ADMIN",
      email: "admin@example.com",
      auth0Id: "auth0|6743f6a0f0ab0e76ba3d7ceb",
      address: "123 Rue Tarantino",
      phone: "222-222-2222",
      firstName: "Gustavo",
      lastName: "Fring",
      pictureUrl:
        "https://sportganise-bucket.s3.us-east-2.amazonaws.com/gus_fring_avatar.png",
    },
    loading: false,
    error: "display error",
  });
  render(<RegisteredPlayer accountId={1} />);
  const firstName = screen.getByText("Gustavo");
  const lastName = screen.getByText("Fring");
  expect(document.body.contains(firstName)).toBe(true);
  expect(document.body.contains(lastName)).toBe(true);
});

test("correctly fetches personal information", () => {
  const mockAccountId = 1;
  const { result } = renderHook(() => usePersonalInformation(mockAccountId));
  expect(result.current.data).not.toBe(null);
  expect(result.current.loading).toEqual(false);
  expect(result.current.error).toEqual(null);
});
