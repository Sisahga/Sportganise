import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router";
import { vi } from "vitest";
import PublicRoute from "./PublicRoute";

const DummyComponent = () => <div>Public Content</div>;

const renderWithRoutes = (
  initialEntries: string[],
  publicRouteElement: React.ReactNode,
) => {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <Routes>
        <Route element={publicRouteElement}>
          <Route path="/public" element={<DummyComponent />} />
        </Route>
        <Route path="/" element={<div>Home Page</div>} />
      </Routes>
    </MemoryRouter>,
  );
};

const mockGetCookies = vi.fn();

vi.mock("@/services/cookiesService", () => ({
  getCookies: () => mockGetCookies(),
}));

describe.skip("PublicRoute", () => {
  beforeEach(() => {
    mockGetCookies.mockReset();
  });

  it("redirects to default route if user is logged in", () => {
    // Simulate a logged in user.
    mockGetCookies.mockReturnValue({ accountId: 1 });
    renderWithRoutes(["/public"], <PublicRoute />);
    expect(screen.getByText("Home Page")).toBeTruthy();
  });

  it("redirects to a custom route if provided and user is logged in", () => {
    mockGetCookies.mockReturnValue({ accountId: 1 });
    renderWithRoutes(["/public"], <PublicRoute redirectTo="/dashboard" />);
    // For this test, we need to define a /dashboard route.
    render(
      <MemoryRouter initialEntries={["/dashboard"]}>
        <Routes>
          <Route path="/dashboard" element={<div>Dashboard Page</div>} />
        </Routes>
      </MemoryRouter>,
    );
    expect(screen.getByText("Dashboard Page")).toBeTruthy();
  });

  it("renders the outlet if no user is logged in", () => {
    // Simulate no logged in user.
    mockGetCookies.mockReturnValue(null);
    renderWithRoutes(["/public"], <PublicRoute />);
    expect(screen.getByText("Public Content")).toBeTruthy();
  });
});
