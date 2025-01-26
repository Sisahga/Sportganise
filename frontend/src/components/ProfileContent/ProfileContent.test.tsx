import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, MockedFunction } from "vitest";
import { MemoryRouter } from "react-router-dom";
import ProfileContent from "./ProfileContent";
import usePersonalInformation from "@/hooks/usePersonalInfromation";
import { getCookies, getTypeCookie } from "@/services/cookiesService";
import { Account } from "@/types/account";
import { useNavigate } from "react-router-dom";
import "@testing-library/jest-dom";

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    __esModule: true,
    ...actual,
    useNavigate: vi.fn(),
    MemoryRouter: actual.MemoryRouter,
  };
});

// Mocking hooks and services
vi.mock("@/hooks/usePersonalInfromation", () => ({
  default: vi.fn(),
}));

vi.mock("@/services/cookiesService", () => ({
  getCookies: vi.fn(),
  getTypeCookie: vi.fn(),
  getAccountIdCookie: vi.fn(),
}));

describe("ProfileContent Component", () => {
  const mockNavigate = vi.fn();
  const mockUseProfile = usePersonalInformation as MockedFunction<
    typeof usePersonalInformation
  >;
  const mockGetCookies = getCookies as MockedFunction<typeof getCookies>;
  const mockGetTypeCookie = getTypeCookie as MockedFunction<
    typeof getTypeCookie
  >;

  const mockCookies = {
    accountId: 123,
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    pictureUrl: "https://via.placeholder.com/150",
    type: "COACH",
    phone: "123-456-7890",
    organisationIds: [1, 2, 3],
    jwtToken: "Token",
  };

  const mockData: Account = {
    accountId: 123,
    type: "COACH",
    email: "john.doe@example.com",
    auth0Id: "auth0|1234567890",
    address: {
      line: "123 Main St",
      city: "Sample City",
      province: "Sample Province",
      country: "Sample Country",
      postalCode: "12345",
    },
    phone: "123-456-7890",
    firstName: "John",
    lastName: "Doe",
    pictureUrl: "https://via.placeholder.com/150",
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockGetCookies.mockReturnValue(mockCookies);
    (useNavigate as MockedFunction<typeof useNavigate>).mockReturnValue(
      mockNavigate,
    );
  });

  it("renders loading state correctly", () => {
    mockUseProfile.mockReturnValue({
      data: null,
      loading: true,
      error: null,
    });

    render(
      <MemoryRouter>
        <ProfileContent />
      </MemoryRouter>,
    );
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("renders error state correctly", () => {
    mockUseProfile.mockReturnValue({
      data: null,
      loading: false,
      error: "Failed to load data",
    });

    render(
      <MemoryRouter>
        <ProfileContent />
      </MemoryRouter>,
    );

    expect(screen.getByText("Failed to load data")).toBeInTheDocument();
  });

  it("renders user profile correctly", () => {
    mockUseProfile.mockReturnValue({
      data: mockData,
      loading: false,
      error: null,
    });

    render(
      <MemoryRouter>
        <ProfileContent />
      </MemoryRouter>,
    );

    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("COACH")).toBeInTheDocument();
    expect(screen.getByAltText("Profile")).toHaveAttribute(
      "src",
      mockData.pictureUrl,
    );
  });

  it("navigates back when the back button is clicked", () => {
    render(
      <MemoryRouter>
        <ProfileContent />
      </MemoryRouter>,
    );

    const buttons = screen.getAllByRole("button");
    const backButton = buttons[0];
    fireEvent.click(backButton);

    // Check if navigate(-1) was called
    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });

  it("navigates to Personal Information page on button click", () => {
    mockUseProfile.mockReturnValue({
      data: mockData,
      loading: false,
      error: null,
    });

    render(
      <MemoryRouter>
        <ProfileContent />
      </MemoryRouter>,
    );

    const personalInfoButton = screen.getByRole("button", {
      name: /Personal Information/i,
    });
    fireEvent.click(personalInfoButton);

    expect(mockNavigate).toHaveBeenCalledWith("/pages/PersonalInformationPage");
  });

  it("navigates to Change Password page on button click", () => {
    mockUseProfile.mockReturnValue({
      data: mockData,
      loading: false,
      error: null,
    });

    render(
      <MemoryRouter>
        <ProfileContent />
      </MemoryRouter>,
    );

    const personalInfoButton = screen.getByRole("button", {
      name: /Change Password/i,
    });
    fireEvent.click(personalInfoButton);

    expect(mockNavigate).toHaveBeenCalledWith("/pages/ChangePasswordPage");
  });

  it("renders Modify Permissions button only for ADMIN", () => {
    mockGetTypeCookie.mockReturnValue("ADMIN");
    mockUseProfile.mockReturnValue({
      data: mockData,
      loading: false,
      error: null,
    });

    render(
      <MemoryRouter>
        <ProfileContent />
      </MemoryRouter>,
    );

    expect(screen.getByText("Modify Permissions")).toBeInTheDocument();
  });

  it("Does not redirect to login when cookies are present", () => {
    render(
      <MemoryRouter>
        <ProfileContent />
      </MemoryRouter>,
    );
    expect(mockNavigate).not.toHaveBeenCalledWith("/login");
  });

  it("does not render Modify Permissions button for non-ADMIN users", () => {
    mockGetTypeCookie.mockReturnValue("COACH");
    mockUseProfile.mockReturnValue({
      data: mockData,
      loading: false,
      error: null,
    });

    render(
      <MemoryRouter>
        <ProfileContent />
      </MemoryRouter>,
    );

    expect(screen.queryByText("Modify Permissions")).not.toBeInTheDocument();
  });
});
