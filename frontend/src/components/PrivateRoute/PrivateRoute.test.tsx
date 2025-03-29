import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router";
import { vi } from "vitest";

const mockClearCookies = vi.fn();
const mockGetCookies = vi.fn();
vi.mock("../../services/cookiesService", () => ({
  clearCookies: () => mockClearCookies(),
  getCookies: () => mockGetCookies(),
}));

const mockGetBearerToken = vi.fn();
vi.mock("../../services/apiHelper.ts", () => ({
  getBearerToken: () => mockGetBearerToken(),
}));

const mockRequestPermission = vi.fn();
vi.mock("../../hooks/useFcmRequestPermission.ts", () => ({
  useRequestNotificationPermission: () => ({
    requestPermission: mockRequestPermission,
  }),
}));

vi.mock("@capacitor/core", () => ({
  Capacitor: {
    getPlatform: () => "web",
  },
}));

import PrivateRoute from "./PrivateRoute";

const renderWithRouter = (ui: React.ReactElement, initialEntries = ["/private"]) => {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <Routes>
        <Route path="/private" element={ui}>
          <Route index element={<div data-testid="private-outlet">Private Content</div>} />
        </Route>
      </Routes>
    </MemoryRouter>
  );
};

describe("PrivateRoute", () => {
  beforeEach(() => {
    mockClearCookies.mockClear();
    mockGetCookies.mockClear();
    mockGetBearerToken.mockClear();
    mockRequestPermission.mockClear();
    localStorage.removeItem("pushNotifications");
  });

  it("redirects to /login when token is invalid", async () => {
    mockGetBearerToken.mockReturnValue("");
    mockGetCookies.mockReturnValue({ accountId: null, type: "PLAYER" });
    renderWithRouter(<PrivateRoute redirectingRoute="/login" />);
    expect(mockClearCookies).toHaveBeenCalled();
    expect(screen.queryByTestId("private-outlet")).not.toBeInTheDocument();
  });

  it("redirects to /login when user's accountId is missing", async () => {
    mockGetBearerToken.mockReturnValue("my-token");
    mockGetCookies.mockReturnValue({ accountId: undefined, type: "PLAYER" });
    renderWithRouter(<PrivateRoute redirectingRoute="/login" />);
    expect(mockClearCookies).toHaveBeenCalled();
    expect(screen.queryByTestId("private-outlet")).not.toBeInTheDocument();
  });

  it("redirects when requiredRole is not met", async () => {
    mockGetBearerToken.mockReturnValue("my-token");
    mockGetCookies.mockReturnValue({ accountId: 1, type: "PLAYER" });
    renderWithRouter(<PrivateRoute requiredRole="COACH" redirectingRoute="/login" />);
    expect(screen.queryByTestId("private-outlet")).not.toBeInTheDocument();
  });

  it("renders Outlet when authenticated and role is matched", async () => {
    mockGetBearerToken.mockReturnValue("my-token");
    mockGetCookies.mockReturnValue({ accountId: 1, type: "PLAYER" });
    renderWithRouter(<PrivateRoute requiredRole="PLAYER" redirectingRoute="/login" />);
    expect(await screen.findByTestId("private-outlet")).toBeInTheDocument();
  });

  it("renders Outlet when authenticated and no requiredRole is specified", async () => {
    mockGetBearerToken.mockReturnValue("my-token");
    mockGetCookies.mockReturnValue({ accountId: 1, type: "PLAYER" });
    renderWithRouter(<PrivateRoute redirectingRoute="/login" />);
    expect(await screen.findByTestId("private-outlet")).toBeInTheDocument();
  });

  it("calls requestPermission if notifications not set and on web", async () => {
    mockGetBearerToken.mockReturnValue("my-token");
    mockGetCookies.mockReturnValue({ accountId: 1, type: "PLAYER" });
    renderWithRouter(<PrivateRoute redirectingRoute="/login" />);
    await waitFor(() => {
      expect(mockRequestPermission).toHaveBeenCalledWith(1);
    });
  });
});
