import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { describe, it, expect, beforeEach, vi } from "vitest";
import LogIn from "./LogIn";

const navigateMock = vi.fn();
vi.mock("react-router", async () => {
  const actual = await vi.importActual("react-router");
  return {
    ...actual,
    useNavigate: () => navigateMock,
  };
});

const toastMock = vi.fn();
vi.mock("@/hooks/use-toast", () => ({
  useToast: () => ({ toast: toastMock }),
}));

let loginData: unknown = null;
let loginError: string | null = null;
const loginUserMock = vi.fn();
vi.mock("@/hooks/useLogin", () => ({
  useLogin: () => ({
    isLoading: false,
    error: loginError,
    data: loginData,
    loginUser: loginUserMock,
  }),
}));

vi.mock("../../assets/Logo.png", () => ({
  default: "logo.png",
}));

describe("LogIn", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    loginData = null;
    loginError = null;
  });

  it("renders the login page", () => {
    render(
      <MemoryRouter>
        <LogIn />
      </MemoryRouter>,
    );
    expect(screen.getByAltText("Logo")).toBeTruthy();
    expect(screen.getByText("Welcome")).toBeTruthy();
    expect(screen.getByText("Please Log in")).toBeTruthy();
    expect(screen.getByPlaceholderText("Email")).toBeTruthy();
    expect(screen.getByPlaceholderText("Password")).toBeTruthy();
    expect(screen.getByRole("button", { name: /Log In/i })).toBeTruthy();
  });

  it("calls loginUser with form data on submit and navigates on success", async () => {
    loginUserMock.mockResolvedValue({ statusCode: 200 });
    loginData = { statusCode: 200 };
    render(
      <MemoryRouter>
        <LogIn />
      </MemoryRouter>,
    );
    const emailInput = screen.getByPlaceholderText("Email") as HTMLInputElement;
    const passwordInput = screen.getByPlaceholderText(
      "Password",
    ) as HTMLInputElement;
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    await waitFor(() => {
      expect(emailInput.value).toBe("test@example.com");
    });
    const submitButton = screen.getByRole("button", { name: /Log In/i });
    fireEvent.click(submitButton);
    await waitFor(() => {
      expect(loginUserMock).toHaveBeenCalledWith({
        email: "test@example.com",
        password: "password123",
      });
    });
    await waitFor(() => {
      expect(navigateMock).toHaveBeenCalledWith("/");
    });
  });

  it("shows error toast if login fails with an error message", async () => {
    loginUserMock.mockRejectedValue(new Error("Invalid credentials"));
    render(
      <MemoryRouter>
        <LogIn />
      </MemoryRouter>,
    );
    const emailInput = screen.getByPlaceholderText("Email") as HTMLInputElement;
    const passwordInput = screen.getByPlaceholderText(
      "Password",
    ) as HTMLInputElement;
    fireEvent.change(emailInput, { target: { value: "wrong@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "wrongpassword" } });
    const submitButton = screen.getByRole("button", { name: /Log In/i });
    fireEvent.click(submitButton);
    await waitFor(() => {
      expect(toastMock).toHaveBeenCalledWith({
        variant: "destructive",
        title: "Login Failed",
        description: "Invalid credentials",
      });
    });
  });

  it("navigates to /verificationcode if error equals 'Account not verified'", async () => {
    loginUserMock.mockRejectedValue(new Error("Account not verified"));
    loginError = "Account not verified";
    render(
      <MemoryRouter>
        <LogIn />
      </MemoryRouter>,
    );
    const emailInput = screen.getByPlaceholderText("Email") as HTMLInputElement;
    const passwordInput = screen.getByPlaceholderText(
      "Password",
    ) as HTMLInputElement;
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    await waitFor(() => {
      expect(emailInput.value).toBe("test@example.com");
    });
    const submitButton = screen.getByRole("button", { name: /Log In/i });
    fireEvent.click(submitButton);
    await waitFor(() => {
      expect(navigateMock).toHaveBeenCalledWith("/verificationcode", {
        state: { email: "" },
      });
    });
    await waitFor(() => {
      expect(toastMock).toHaveBeenCalledWith({
        variant: "destructive",
        title: "Login Failed",
        description: "Account not verified",
      });
    });
  });
});
