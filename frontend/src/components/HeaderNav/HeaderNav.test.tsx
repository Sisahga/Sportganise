import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { describe, it, expect, beforeEach, vi } from "vitest";
import HeaderNav from "./HeaderNav";

const navigateMock = vi.fn();
vi.mock("react-router", async () => {
  const actual = await vi.importActual("react-router");
  return {
    ...actual,
    useNavigate: () => navigateMock,
  };
});

vi.mock("@/services/cookiesService", () => ({
  getCookies: vi.fn(),
  clearCookies: vi.fn(),
}));
import { clearCookies } from "@/services/cookiesService";

vi.mock("@/components/ui/drawer", () => ({
  Drawer: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  DrawerContent: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  DrawerHeader: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  DrawerTrigger: ({
    children,
    ...props
  }: {
    children: React.ReactNode;
  } & React.ButtonHTMLAttributes<HTMLButtonElement>) => (
    <button {...props}>{children}</button>
  ),
}));

vi.mock("../../assets/Logo.png", () => ({
  default: "logo.png",
}));

describe.skip("HeaderNav", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Default to a non-coach user.
    // vi.mocked(getCookies).mockReturnValue({
    //   type: "user",
    //   accountId: null,
    //   firstName: "",
    //   lastName: "",
    //   email: "",
    //   pictureUrl: null,
    //   phone: null,
    //   organisationIds: [],
    //   jwtToken: null,
    // });
  });

  it("renders header nav with logo and basic nav links for a non-coach/admin user", () => {
    render(
      <MemoryRouter>
        <HeaderNav />
      </MemoryRouter>,
    );

    // Check that at least one logo is rendered.
    const logoImages = screen.getAllByAltText("Logo");
    expect(logoImages.length).toBeGreaterThanOrEqual(1);

    // Check basic navigation links.
    expect(screen.getByText("Home")).toBeDefined();
    expect(screen.getByText("Forum")).toBeDefined();
    expect(screen.getByText("Settings")).toBeDefined();
    expect(screen.getByText("Log Out")).toBeDefined();

    // Additional coach/admin links should not be present.
    expect(screen.queryByText("Create Program")).toBeNull();
    expect(screen.queryByText("Training Plan")).toBeNull();
  });

  it("renders additional nav links for coach/admin users", () => {
    // Simulate an account of type "coach".
    // vi.mocked(getCookies).mockReturnValue({
    //   type: "coach",
    //   accountId: null,
    //   firstName: "",
    //   lastName: "",
    //   email: "",
    //   pictureUrl: null,
    //   phone: null,
    //   organisationIds: [],
    //   jwtToken: null,
    // });
    render(
      <MemoryRouter>
        <HeaderNav />
      </MemoryRouter>,
    );

    // Check that all expected links are rendered.
    expect(screen.getByText("Home")).toBeDefined();
    expect(screen.getByText("Forum")).toBeDefined();
    expect(screen.getByText("Create Program")).toBeDefined();
    expect(screen.getByText("Training Plan")).toBeDefined();
    expect(screen.getByText("Settings")).toBeDefined();
    expect(screen.getByText("Log Out")).toBeDefined();
  });

  it("calls clearCookies and navigates to '/login' when Log Out is clicked", () => {
    // vi.mocked(getCookies).mockReturnValue({
    //   type: "user",
    //   accountId: null,
    //   firstName: "",
    //   lastName: "",
    //   email: "",
    //   pictureUrl: null,
    //   phone: null,
    //   organisationIds: [],
    //   jwtToken: null,
    // });
    render(
      <MemoryRouter>
        <HeaderNav />
      </MemoryRouter>,
    );

    const logoutButton = screen.getByText("Log Out");
    fireEvent.click(logoutButton);

    expect(clearCookies).toHaveBeenCalled();
    expect(navigateMock).toHaveBeenCalledWith("/login");
  });
});
