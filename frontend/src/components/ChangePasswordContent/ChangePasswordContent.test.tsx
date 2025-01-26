import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { MemoryRouter } from "react-router";
import ChangePasswordContent from "./ChangePasswordContent";
import useModifyPassword from "@/hooks/useModifyPassword";
import { getCookies, getEmailCookie } from "@/services/cookiesService";
import { useToast } from "@/hooks/use-toast";
import { MockedFunction } from "vitest";
import { useNavigate } from "react-router";
import "@testing-library/jest-dom";

vi.mock("react-router", async () => {
  const actual = await vi.importActual("react-router");
  return {
    __esModule: true,
    ...actual,
    useNavigate: vi.fn(),
    MemoryRouter: actual.MemoryRouter,
  };
});

// Mocking external dependencies
vi.mock("@/hooks/useModifyPassword", () => ({
  default: vi.fn(),
}));
vi.mock("@/services/cookiesService", () => ({
  getCookies: vi.fn(),
  getEmailCookie: vi.fn(),
}));
vi.mock("@/hooks/use-toast", () => ({
  useToast: vi.fn().mockReturnValue({
    toast: vi.fn(),
    dismiss: vi.fn(),
    toasts: [],
  }),
}));

describe("ChangePasswordContent Component", () => {
  const mockNavigate = vi.fn();
  const mockToast = vi.fn();
  const mockModifyPassword = vi.fn();

  // Setting up mock hooks and functions
  beforeEach(() => {
    vi.clearAllMocks();
    (useNavigate as MockedFunction<typeof useNavigate>).mockReturnValue(
      mockNavigate,
    );
    (useToast as MockedFunction<typeof useToast>).mockReturnValue({
      toast: mockToast,
      dismiss: vi.fn(),
      toasts: [],
    });
    (
      useModifyPassword as MockedFunction<typeof useModifyPassword>
    ).mockReturnValue({
      isLoading: false,
      success: false,
      Message: "Password change failed",
      error: false,
      modifyPassword: mockModifyPassword,
    });
    (getCookies as MockedFunction<typeof getCookies>).mockReturnValue({
      accountId: 123,
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
      pictureUrl: "https://via.placeholder.com/150",
      type: "COACH",
      phone: "123-456-7890",
      organisationIds: [1, 2, 3],
      jwtToken: "Token",
    });
    (getEmailCookie as MockedFunction<typeof getEmailCookie>).mockReturnValue(
      "john.doe@example.com",
    );
  });

  it("renders password form with default values", async () => {
    const formValues = {
      oldPassword: "",
      password: "",
      passwordAgain: "",
    };

    render(
      <MemoryRouter>
        <ChangePasswordContent />
      </MemoryRouter>,
    );

    expect(
      screen.getByPlaceholderText("Enter your current password"),
    ).toHaveValue(formValues.oldPassword);
    expect(screen.getByPlaceholderText("Enter your new password")).toHaveValue(
      formValues.password,
    );
    expect(
      screen.getByPlaceholderText("Confirm your new password"),
    ).toHaveValue(formValues.passwordAgain);
  });

  it("Input changes succesfully", async () => {
    const formValues = {
      oldPassword: "OldPassword123",
      password: "StrongPassword123!",
      passwordAgain: "StrongPassword123!",
    };

    render(
      <MemoryRouter>
        <ChangePasswordContent />
      </MemoryRouter>,
    );

    fireEvent.change(
      screen.getByPlaceholderText("Enter your current password"),
      {
        target: { value: formValues.oldPassword },
      },
    );
    fireEvent.change(screen.getByPlaceholderText("Enter your new password"), {
      target: { value: formValues.password },
    });
    fireEvent.change(screen.getByPlaceholderText("Confirm your new password"), {
      target: { value: formValues.passwordAgain },
    });

    expect(
      screen.getByPlaceholderText("Enter your current password"),
    ).toHaveValue(formValues.oldPassword);
    expect(screen.getByPlaceholderText("Enter your new password")).toHaveValue(
      formValues.password,
    );
    expect(
      screen.getByPlaceholderText("Confirm your new password"),
    ).toHaveValue(formValues.passwordAgain);
  });

  it("navigates back when the back button is clicked", () => {
    render(
      <MemoryRouter>
        <ChangePasswordContent />
      </MemoryRouter>,
    );

    const buttons = screen.getAllByRole("button");
    const backButton = buttons[0];
    fireEvent.click(backButton);

    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });

  it("disables the submit button while the password is changing", () => {
    (
      useModifyPassword as MockedFunction<typeof useModifyPassword>
    ).mockReturnValueOnce({
      isLoading: true,
      success: false,
      Message: "Password change failed",
      error: false,
      modifyPassword: mockModifyPassword,
    });

    render(
      <MemoryRouter>
        <ChangePasswordContent />
      </MemoryRouter>,
    );

    const buttons = screen.getAllByRole("button");
    const submitButton = buttons[1];
    expect(submitButton).toBeDisabled();
  });

  it("shows password strength progress bar", () => {
    render(
      <MemoryRouter>
        <ChangePasswordContent />
      </MemoryRouter>,
    );

    const passwordInput = screen.getByPlaceholderText(
      "Enter your new password",
    );
    fireEvent.change(passwordInput, {
      target: { value: "StrongPassword123!" },
    });

    expect(screen.getByRole("progressbar")).toBeInTheDocument();
  });

  it("calls modifyPassword when the form is submitted", async () => {
    render(
      <MemoryRouter>
        <ChangePasswordContent />
      </MemoryRouter>,
    );

    const passwordInput = screen.getByPlaceholderText(
      "Enter your new password",
    );
    const confirmPasswordInput = screen.getByPlaceholderText(
      "Confirm your new password",
    );
    const oldPasswordInput = screen.getByPlaceholderText(
      "Enter your current password",
    );

    fireEvent.change(oldPasswordInput, { target: { value: "OldPassword123" } });
    fireEvent.change(passwordInput, {
      target: { value: "StrongPassword123!" },
    });
    fireEvent.change(confirmPasswordInput, {
      target: { value: "StrongPassword123!" },
    });

    const submitButton = screen.getByRole("button", {
      name: /change password/i,
    });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockModifyPassword).toHaveBeenCalledWith({
        email: "john.doe@example.com",
        oldPassword: "OldPassword123",
        newPassword: "StrongPassword123!",
      });
    });
  });

  it("shows error message if the password checklist is not valid", async () => {
    render(
      <MemoryRouter>
        <ChangePasswordContent />
      </MemoryRouter>,
    );

    const passwordInput = screen.getByPlaceholderText(
      "Enter your new password",
    );
    const confirmPasswordInput = screen.getByPlaceholderText(
      "Confirm your new password",
    );
    const oldPasswordInput = screen.getByPlaceholderText(
      "Enter your current password",
    );

    fireEvent.change(oldPasswordInput, { target: { value: "OldPassword123" } });
    fireEvent.change(passwordInput, { target: { value: "StrongPassword12!" } });
    fireEvent.change(confirmPasswordInput, {
      target: { value: "StrongPassword123!" },
    });

    const submitButton = screen.getByRole("button", {
      name: /change password/i,
    });
    fireEvent.click(submitButton);

    await waitFor(() =>
      expect(mockToast).toHaveBeenCalledWith({
        title: "Password change unsuccessful!",
        description: "Please ensure the checklist is fulfilled.",
        variant: "destructive",
      }),
    );
  });

  it("shows success toast message on successful password change", async () => {
    (
      useModifyPassword as MockedFunction<typeof useModifyPassword>
    ).mockReturnValueOnce({
      isLoading: false,
      success: true,
      Message: "Password changed successfully",
      error: false,
      modifyPassword: mockModifyPassword,
    });

    render(
      <MemoryRouter>
        <ChangePasswordContent />
      </MemoryRouter>,
    );
    const submitButton = screen.getByRole("button", {
      name: /change password/i,
    });
    fireEvent.click(submitButton);

    await waitFor(() =>
      expect(mockToast).toHaveBeenCalledWith({
        title: "Success!",
        description: "Password changed successfully",
        variant: "success",
      }),
    );
  });

  it("shows error toast message on password change failure", async () => {
    (
      useModifyPassword as MockedFunction<typeof useModifyPassword>
    ).mockReturnValueOnce({
      isLoading: false,
      success: false,
      Message: "Password change failed",
      error: true,
      modifyPassword: mockModifyPassword,
    });

    render(
      <MemoryRouter>
        <ChangePasswordContent />
      </MemoryRouter>,
    );
    const submitButton = screen.getByRole("button", {
      name: /change password/i,
    });
    fireEvent.click(submitButton);

    await waitFor(() =>
      expect(mockToast).toHaveBeenCalledWith({
        title: "Error!",
        description: "Password change failed",
        variant: "destructive",
      }),
    );
  });
});
