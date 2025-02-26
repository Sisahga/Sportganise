import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { vi } from "vitest";
import ChangeForgottenPasswordContent from "./ResetPassword";

const mockToast = vi.fn();
vi.mock("@/hooks/use-toast", () => ({
  useToast: () => ({
    toast: mockToast,
  }),
}));

const mockResetPassword = vi.fn();
let resetHookState = {
  resetPassword: mockResetPassword,
  isLoading: false,
  message: "",
  success: false,
  error: false,
};
vi.mock("@/hooks/useResetPassword", () => ({
  __esModule: true,
  default: () => resetHookState,
}));

const mockNavigate = vi.fn();
vi.mock("react-router", async () => {
  const actual = await vi.importActual("react-router");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useLocation: () => ({
      state: { email: "test@example.com", flow: "reset" },
    }),
  };
});

describe("ChangeForgottenPasswordContent", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    resetHookState = {
      resetPassword: mockResetPassword,
      isLoading: false,
      message: "",
      success: false,
      error: false,
    };
  });

  it("renders the reset password form", () => {
    render(
      <MemoryRouter>
        <ChangeForgottenPasswordContent />
      </MemoryRouter>,
    );
    // Query only div elements to pick up the card header, not the submit button.
    expect(
      screen.getByText(/Reset Password/i, { selector: "div" }),
    ).toBeTruthy();
    expect(
      screen.getByPlaceholderText(/Enter your new password/i),
    ).toBeTruthy();
    expect(
      screen.getByPlaceholderText(/Confirm your new password/i),
    ).toBeTruthy();
  });

  it("shows an error toast if the password checklist is not valid", async () => {
    render(
      <MemoryRouter>
        <ChangeForgottenPasswordContent />
      </MemoryRouter>,
    );
    const passwordInput = screen.getByPlaceholderText(
      /Enter your new password/i,
    );
    const confirmPasswordInput = screen.getByPlaceholderText(
      /Confirm your new password/i,
    );
    fireEvent.change(passwordInput, { target: { value: "short" } });
    fireEvent.change(confirmPasswordInput, { target: { value: "short" } });
    const submitButton = screen.getByRole("button", {
      name: /Reset Password/i,
    });
    fireEvent.click(submitButton);
    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        title: "Password reset unsuccessful!",
        description: "Please ensure the checklist is fulfilled.",
        variant: "destructive",
      });
    });
    expect(mockResetPassword).not.toHaveBeenCalled();
  });

  it("calls resetPassword and navigates on successful reset", async () => {
    render(
      <MemoryRouter>
        <ChangeForgottenPasswordContent />
      </MemoryRouter>,
    );
    const validPassword = "Password1!";
    const passwordInput = screen.getByPlaceholderText(
      /Enter your new password/i,
    );
    const confirmPasswordInput = screen.getByPlaceholderText(
      /Confirm your new password/i,
    );
    fireEvent.change(passwordInput, { target: { value: validPassword } });
    fireEvent.change(confirmPasswordInput, {
      target: { value: validPassword },
    });
    resetHookState.success = true;
    resetHookState.message = "Password reset successful!";
    const submitButton = screen.getByRole("button", {
      name: /Reset Password/i,
    });
    fireEvent.click(submitButton);
    await waitFor(() => {
      expect(mockResetPassword).toHaveBeenCalledWith({
        email: "test@example.com",
        newPassword: validPassword,
      });
    });
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/login");
      expect(mockToast).toHaveBeenCalledWith({
        title: "Success!",
        description: "Password reset successful!",
        variant: "success",
      });
    });
  });

  it("shows an error toast if resetPassword fails", async () => {
    render(
      <MemoryRouter>
        <ChangeForgottenPasswordContent />
      </MemoryRouter>,
    );
    const validPassword = "Password1!";
    const passwordInput = screen.getByPlaceholderText(
      /Enter your new password/i,
    );
    const confirmPasswordInput = screen.getByPlaceholderText(
      /Confirm your new password/i,
    );
    fireEvent.change(passwordInput, { target: { value: validPassword } });
    fireEvent.change(confirmPasswordInput, {
      target: { value: validPassword },
    });
    resetHookState.error = true;
    resetHookState.message = "Reset failed.";
    const submitButton = screen.getByRole("button", {
      name: /Reset Password/i,
    });
    fireEvent.click(submitButton);
    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        title: "Error!",
        description: "Reset failed.",
        variant: "destructive",
      });
    });
  });
});
