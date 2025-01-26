import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, MockedFunction } from "vitest";
import { MemoryRouter } from "react-router-dom";
import PersonalInformationContent from "./PersonalInformationContent";
import usePersonalInformation from "@/hooks/usePersonalInfromation";
import { getCookies, getAccountIdCookie } from "@/services/cookiesService";
import { useNavigate } from "react-router-dom";
import "@testing-library/jest-dom";
import { Account } from "@/types/account";
import { CookiesDto } from "@/types/auth";

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    __esModule: true,
    ...actual,
    useNavigate: vi.fn(),
    MemoryRouter: actual.MemoryRouter,
  };
});

vi.mock("@/hooks/usePersonalInfromation", () => ({
  default: vi.fn(),
}));

vi.mock("@/services/cookiesService", () => ({
  getCookies: vi.fn<() => CookiesDto | null>(),
  getAccountIdCookie: vi.fn(),
}));

describe("PersonalInformationContent Component", () => {
  const mockNavigate = vi.fn();
  const mockUsePersonalInformation = usePersonalInformation as MockedFunction<
    typeof usePersonalInformation
  >;
  const mockGetCookies = getCookies as MockedFunction<typeof getCookies>;
  const mockGetAccountIdCookie = getAccountIdCookie as MockedFunction<
    typeof getAccountIdCookie
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
    jwtToken: "token",
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

  const Fields = [
    { label: "First Name", value: mockData.firstName },
    { label: "Last Name", value: mockData.lastName },
    { label: "Email", value: mockData.email },
    { label: "Phone", value: mockData.phone },
    { label: "Address", value: mockData.address.line },
    { label: "Postal Code", value: mockData.address.postalCode },
    { label: "City", value: mockData.address.city },
    { label: "Province", value: mockData.address.province },
    { label: "Country", value: mockData.address.country },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    mockGetCookies.mockReturnValue(mockCookies);
    mockGetAccountIdCookie.mockReturnValue(mockCookies.accountId);
    (useNavigate as MockedFunction<typeof useNavigate>).mockReturnValue(
      mockNavigate,
    );
  });

  it("renders loading state correctly", () => {
    mockUsePersonalInformation.mockReturnValue({
      data: null,
      loading: true,
      error: null,
    });

    render(
      <MemoryRouter>
        <PersonalInformationContent />
      </MemoryRouter>,
    );

    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("renders error state correctly", () => {
    mockUsePersonalInformation.mockReturnValue({
      data: null,
      loading: false,
      error: "Failed to load data",
    });

    render(
      <MemoryRouter>
        <PersonalInformationContent />
      </MemoryRouter>,
    );

    expect(screen.getByText("Failed to load data")).toBeInTheDocument();
  });

  it("renders user profile data correctly", () => {
    mockUsePersonalInformation.mockReturnValue({
      data: mockData,
      loading: false,
      error: null,
    });

    render(
      <MemoryRouter>
        <PersonalInformationContent />
      </MemoryRouter>,
    );

    expect(screen.getByText("Personal Information")).toBeInTheDocument();
    Fields.forEach((field) => {
      expect(screen.getByLabelText(field.label)).toHaveValue(field.value);
    });
    expect(screen.getByAltText("Profile")).toHaveAttribute(
      "src",
      mockData.pictureUrl,
    );
  });

  it("ensures non-editable fields are disabled", () => {
    mockUsePersonalInformation.mockReturnValue({
      data: mockData,
      loading: false,
      error: null,
    });

    render(
      <MemoryRouter>
        <PersonalInformationContent />
      </MemoryRouter>,
    );

    Fields.forEach((field) => {
      const inputField = screen.getByLabelText(field.label) as HTMLInputElement;
      expect(inputField).toBeDisabled();
    });
  });

  it("redirects to login page if no account is found", () => {
    mockGetAccountIdCookie.mockReturnValue(0);

    render(
      <MemoryRouter>
        <PersonalInformationContent />
      </MemoryRouter>,
    );

    expect(mockNavigate).toHaveBeenCalledWith("/login");
  });

  it("navigates back to the profile page when the back button is clicked", () => {
    render(
      <MemoryRouter>
        <PersonalInformationContent />
      </MemoryRouter>,
    );

    const buttons = screen.getAllByRole("button");
    const backButton = buttons[0];
    fireEvent.click(backButton);

    expect(mockNavigate).toHaveBeenCalledWith("/pages/ProfilePage");
  });

  it("navigates to Edit Profile page when Edit button is clicked", () => {
    mockUsePersonalInformation.mockReturnValue({
      data: mockData,
      loading: false,
      error: null,
    });

    render(
      <MemoryRouter>
        <PersonalInformationContent />
      </MemoryRouter>,
    );

    const editButton = screen.getByRole("button", { name: /edit/i });
    fireEvent.click(editButton);

    expect(mockNavigate).toHaveBeenCalledWith("/pages/EditProfilePage");
  });
});
