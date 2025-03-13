import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router";
import { vi } from "vitest";
import PrivateRoute from "./PrivateRoute";

const DummyComponent = () => <div>Private Content</div>;

const renderWithRoutes = (
  initialEntries: string[],
  privateRouteElement: React.ReactNode,
) => {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <Routes>
        <Route element={privateRouteElement}>
          <Route path="/private" element={<DummyComponent />} />
        </Route>
        <Route path="/login" element={<div>Login Page</div>} />
      </Routes>
    </MemoryRouter>,
  );
};

const mockGetCookies = vi.fn();
const mockClearCookies = vi.fn();
const mockGetBearerToken = vi.fn();

// Mock the Firebase messaging module
vi.mock("firebase/messaging", () => ({
  getMessaging: vi.fn(() => ({})), // Return a mocked empty object or a mock function
}));

vi.mock("@/services/cookiesService", () => ({
  getCookies: () => mockGetCookies(),
  clearCookies: () => mockClearCookies(),
}));

vi.mock("@/services/apiHelper.ts", () => ({
  getBearerToken: () => mockGetBearerToken(),
}));

describe("PrivateRoute", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("redirects to /login if token is invalid", () => {
    mockGetCookies.mockReturnValue({ accountId: null });
    mockGetBearerToken.mockReturnValue(null);

    renderWithRoutes(["/private"], <PrivateRoute />);

    expect(screen.getByText("Login Page")).toBeTruthy();
    expect(mockClearCookies).toHaveBeenCalled();
  });

  it("redirects to /login if user role is not authorized", () => {
    // Valid token and account, but user is not authorized for required role.
    mockGetCookies.mockReturnValue({ accountId: 1, type: "PLAYER" });
    mockGetBearerToken.mockReturnValue("valid-token");

    renderWithRoutes(["/private"], <PrivateRoute requiredRole="ADMIN" />);

    expect(screen.getByText("Login Page")).toBeTruthy();
  });

  it("renders the outlet when token is valid and user is authorized", () => {
    mockGetCookies.mockReturnValue({ accountId: 1, type: "PLAYER" });
    mockGetBearerToken.mockReturnValue("valid-token");

    renderWithRoutes(["/private"], <PrivateRoute requiredRole="PLAYER" />);

    expect(screen.getByText("Private Content")).toBeTruthy();
  });

  it("renders the outlet when token is valid and user is ADMIN regardless of requiredRole", () => {
    mockGetCookies.mockReturnValue({ accountId: 1, type: "ADMIN" });
    mockGetBearerToken.mockReturnValue("valid-token");

    renderWithRoutes(["/private"], <PrivateRoute requiredRole="PLAYER" />);

    expect(screen.getByText("Private Content")).toBeTruthy();
  });
});
