import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { MemoryRouter } from "react-router";
import EditProfileContent from "./EditProfileContent";
import { useToast } from "@/hooks/use-toast";
import useUpdateAccount from "@/hooks/useUpdateAccount";
import useUpdateProfilePicture from "@/hooks/useUpdateProfilePicture";
import usePersonalInformation from "@/hooks/usePersonalInfromation";
import { MockedFunction } from "vitest";
import { Account } from "@/types/account";
import { getCookies } from "@/services/cookiesService";
import { CookiesDto } from "@/types/auth";
import { useNavigate } from "react-router";
import "@testing-library/jest-dom";

// Mocking the hooks and services
vi.mock("react-router", async () => {
  const actual = await vi.importActual("react-router");
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
  getCookies: vi.fn(),
  getAccountIdCookie: vi.fn(),
}));

// Mocking the hooks
vi.mock("@/hooks/use-toast", () => ({
  useToast: vi.fn(),
}));

vi.mock("@/hooks/useUpdateAccount", () => ({
  default: vi.fn().mockReturnValue({
    success: true,
    message: "Profile updated successfully",
    updateAccount: vi.fn(),
  }),
}));

vi.mock("@/hooks/useUpdateProfilePicture", () => ({
  default: vi.fn().mockReturnValue({
    updateProfilePicture: vi.fn(),
  }),
}));

describe("EditProfileContent Component", () => {
  const mockNavigate = vi.fn();
  const mockToast = vi.fn();
  const mockUpdateAccount = vi.fn();
  const mockUpdateProfilePicture = vi.fn();
  const mockUsePersonalInformation = usePersonalInformation as MockedFunction<
    typeof usePersonalInformation
  >;
  const mockUseUpdateAccount = useUpdateAccount as MockedFunction<
    typeof useUpdateAccount
  >;
  const mockUseUpdateProfilePicture = useUpdateProfilePicture as MockedFunction<
    typeof useUpdateProfilePicture
  >;

  const mockPersonalInfo: Account = {
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

  const Cookies: CookiesDto = {
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

  beforeEach(() => {
    vi.clearAllMocks();
    (useNavigate as MockedFunction<typeof useNavigate>).mockReturnValue(
      mockNavigate,
    );
    mockUsePersonalInformation.mockReturnValue({
      data: mockPersonalInfo,
      loading: false,
      error: null,
    });
    mockUseUpdateAccount.mockReturnValue({
      success: true,
      message: "Profile updated successfully",
      updateAccount: mockUpdateAccount,
    });

    (getCookies as MockedFunction<typeof getCookies>).mockReturnValue(Cookies);
    mockUseUpdateProfilePicture.mockReturnValue({
      updateProfilePicture: mockUpdateProfilePicture,
    });
    (useToast as MockedFunction<typeof useToast>).mockReturnValue({
      toast: mockToast,
      dismiss: vi.fn(),
      toasts: [],
    });
  });

  it("navigates back when the back button is clicked", () => {
    render(
      <MemoryRouter>
        <EditProfileContent />
      </MemoryRouter>,
    );

    const backButton = screen.getByRole("button", { name: /back/i });
    fireEvent.click(backButton);

    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });

  it("renders form fields with initial values", () => {
    render(
      <MemoryRouter>
        <EditProfileContent />
      </MemoryRouter>,
    );

    expect(screen.getByLabelText("First Name")).toHaveValue(
      mockPersonalInfo.firstName,
    );
    expect(screen.getByLabelText("Last Name")).toHaveValue(
      mockPersonalInfo.lastName,
    );
    expect(screen.getByLabelText("Email")).toHaveValue(mockPersonalInfo.email);
    expect(screen.getByLabelText("Phone")).toHaveValue(mockPersonalInfo.phone);
    expect(screen.getByLabelText("Address")).toHaveValue(
      mockPersonalInfo.address.line,
    );
    expect(screen.getByLabelText("City")).toHaveValue(
      mockPersonalInfo.address.city,
    );
    expect(screen.getByLabelText("Province")).toHaveValue(
      mockPersonalInfo.address.province,
    );
    expect(screen.getByLabelText("Postal Code")).toHaveValue(
      mockPersonalInfo.address.postalCode,
    );
    expect(screen.getByLabelText("Country")).toHaveValue(
      mockPersonalInfo.address.country,
    );
  });

  it("shows loading state when data is being fetched", () => {
    mockUsePersonalInformation.mockReturnValue({
      data: null,
      loading: true,
      error: null,
    });

    render(
      <MemoryRouter>
        <EditProfileContent />
      </MemoryRouter>,
    );

    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("displays error message when there is an error fetching personal information", () => {
    mockUsePersonalInformation.mockReturnValue({
      data: null,
      loading: false,
      error: "Error loading data",
    });

    render(
      <MemoryRouter>
        <EditProfileContent />
      </MemoryRouter>,
    );

    expect(screen.getByText("Error loading data")).toBeInTheDocument();
  });

  it("handles form changes", async () => {
    const formValues = {
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
      phone: "123-456-7890",
      address: "123 Main St",
      city: "Sample City",
      province: "Sample Province",
      postalCode: "12345",
      country: "Sample Country",
    };

    render(
      <MemoryRouter>
        <EditProfileContent />
      </MemoryRouter>,
    );

    fireEvent.change(screen.getByLabelText("First Name"), {
      target: { value: formValues.firstName },
    });
    fireEvent.change(screen.getByLabelText("Last Name"), {
      target: { value: formValues.lastName },
    });
    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: formValues.email },
    });
    fireEvent.change(screen.getByLabelText("Phone"), {
      target: { value: formValues.phone },
    });
    fireEvent.change(screen.getByLabelText("Address"), {
      target: { value: formValues.address },
    });
    fireEvent.change(screen.getByLabelText("City"), {
      target: { value: formValues.city },
    });
    fireEvent.change(screen.getByLabelText("Province"), {
      target: { value: formValues.province },
    });
    fireEvent.change(screen.getByLabelText("Postal Code"), {
      target: { value: formValues.postalCode },
    });
    fireEvent.change(screen.getByLabelText("Country"), {
      target: { value: formValues.country },
    });

    expect(screen.getByLabelText("First Name")).toHaveValue(
      formValues.firstName,
    );
    expect(screen.getByLabelText("Last Name")).toHaveValue(formValues.lastName);
    expect(screen.getByLabelText("Email")).toHaveValue(formValues.email);
    expect(screen.getByLabelText("Phone")).toHaveValue(formValues.phone);
    expect(screen.getByLabelText("Address")).toHaveValue(formValues.address);
    expect(screen.getByLabelText("City")).toHaveValue(formValues.city);
    expect(screen.getByLabelText("Province")).toHaveValue(formValues.province);
    expect(screen.getByLabelText("Postal Code")).toHaveValue(
      formValues.postalCode,
    );
    expect(screen.getByLabelText("Country")).toHaveValue(formValues.country);
  });

  it("shows toast on successful profile update", async () => {
    render(
      <MemoryRouter>
        <EditProfileContent />
      </MemoryRouter>,
    );

    const saveButton = screen.getByRole("button", { name: /save/i });
    fireEvent.click(saveButton);

    await waitFor(() =>
      expect(mockToast).toHaveBeenCalledWith({
        title: "Profile Updated",
        description: "Profile updated successfully",
        variant: "default",
      }),
    );
  });

  it("shows toast on failed profile update", async () => {
    mockUseUpdateAccount.mockReturnValue({
      success: false,
      message: "Update failed",
      updateAccount: mockUpdateAccount,
    });

    render(
      <MemoryRouter>
        <EditProfileContent />
      </MemoryRouter>,
    );

    const saveButton = screen.getByRole("button", { name: /save/i });
    fireEvent.click(saveButton);

    await waitFor(() =>
      expect(mockToast).toHaveBeenCalledWith({
        title: "Update Failed",
        description: "Update failed",
        variant: "destructive",
      }),
    );
  });
});
