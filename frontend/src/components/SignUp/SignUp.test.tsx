import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import SignUp from "./SignUp";
import { vi } from "vitest";

const mockToast = vi.fn();
vi.mock("@/hooks/use-toast", () => ({
  useToast: () => ({
    toast: mockToast,
  }),
}));

const mockSignUpUser = vi.fn();
let signUpState: {
  signUpUser: typeof mockSignUpUser;
  isLoading: boolean;
  error: string | null;
} = {
  signUpUser: mockSignUpUser,
  isLoading: false,
  error: null,
};
vi.mock("@/hooks/useSignUp", () => ({
  useSignUp: () => signUpState,
}));

const mockSendVerificationCode = vi.fn();
let sendCodeState: {
  sendVerificationCode: typeof mockSendVerificationCode;
  isLoading: boolean;
  error: string | null;
} = {
  sendVerificationCode: mockSendVerificationCode,
  isLoading: false,
  error: null,
};
vi.mock("@/hooks/useSendCode", () => ({
  useSendCode: () => sendCodeState,
}));

const mockNavigate = vi.fn();
vi.mock("react-router", async () => {
  const actual = await vi.importActual("react-router");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe("SignUp component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    signUpState = {
      signUpUser: mockSignUpUser,
      isLoading: false,
      error: null,
    };
    sendCodeState = {
      sendVerificationCode: mockSendVerificationCode,
      isLoading: false,
      error: null,
    };
  });

  it("renders sign up form with necessary fields", () => {
    render(
      <MemoryRouter>
        <SignUp />
      </MemoryRouter>,
    );
    expect(screen.getByPlaceholderText(/Email/i)).toBeTruthy();
    expect(screen.getByPlaceholderText(/Password/i)).toBeTruthy();
    expect(screen.getByPlaceholderText(/First Name/i)).toBeTruthy();
    expect(screen.getByPlaceholderText(/Last Name/i)).toBeTruthy();
    expect(screen.getByPlaceholderText(/Street #, Name/i)).toBeTruthy();
    expect(screen.getByPlaceholderText(/Postal Code/i)).toBeTruthy();
    expect(screen.getByPlaceholderText(/City/i)).toBeTruthy();
    expect(screen.getByPlaceholderText(/Prov/i)).toBeTruthy();
    expect(screen.getByPlaceholderText(/Country/i)).toBeTruthy();
  });

  it("shows toast for weak password", async () => {
    render(
      <MemoryRouter>
        <SignUp />
      </MemoryRouter>,
    );
    fireEvent.change(screen.getByPlaceholderText(/Email/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText(/Password/i), {
      target: { value: "weak" },
    });
    fireEvent.change(screen.getByPlaceholderText(/First Name/i), {
      target: { value: "John" },
    });
    fireEvent.change(screen.getByPlaceholderText(/Last Name/i), {
      target: { value: "Doe" },
    });
    fireEvent.change(screen.getByPlaceholderText(/Street #, Name/i), {
      target: { value: "123 Main St" },
    });
    fireEvent.change(screen.getByPlaceholderText(/Postal Code/i), {
      target: { value: "12345" },
    });
    fireEvent.change(screen.getByPlaceholderText(/City/i), {
      target: { value: "Anytown" },
    });
    fireEvent.change(screen.getByPlaceholderText(/Prov/i), {
      target: { value: "State" },
    });
    fireEvent.change(screen.getByPlaceholderText(/Country/i), {
      target: { value: "Country" },
    });
    fireEvent.click(screen.getByRole("button", { name: /Sign Up/i }));
    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        variant: "destructive",
        title: "Weak Password",
        description:
          "Password must meet at least 3 of the following: 8 characters, uppercase letter, lowercase letter, special character.",
      });
    });
    expect(mockSignUpUser).not.toHaveBeenCalled();
  });

  it("calls signUpUser and sends verification code on successful sign up", async () => {
    mockSignUpUser.mockResolvedValue({ statusCode: 201 });
    render(
      <MemoryRouter>
        <SignUp />
      </MemoryRouter>,
    );
    fireEvent.change(screen.getByPlaceholderText(/Email/i), {
      target: { value: "test@example.com" },
    });
    const validPassword = "StrongPass1!";
    fireEvent.change(screen.getByPlaceholderText(/Password/i), {
      target: { value: validPassword },
    });
    fireEvent.change(screen.getByPlaceholderText(/First Name/i), {
      target: { value: "John" },
    });
    fireEvent.change(screen.getByPlaceholderText(/Last Name/i), {
      target: { value: "Doe" },
    });
    fireEvent.change(screen.getByPlaceholderText(/Street #, Name/i), {
      target: { value: "123 Main St" },
    });
    fireEvent.change(screen.getByPlaceholderText(/Postal Code/i), {
      target: { value: "12345" },
    });
    fireEvent.change(screen.getByPlaceholderText(/City/i), {
      target: { value: "Anytown" },
    });
    fireEvent.change(screen.getByPlaceholderText(/Prov/i), {
      target: { value: "State" },
    });
    fireEvent.change(screen.getByPlaceholderText(/Country/i), {
      target: { value: "Country" },
    });
    fireEvent.click(screen.getByRole("button", { name: /Sign Up/i }));
    await waitFor(() => {
      expect(mockSignUpUser).toHaveBeenCalledWith(
        expect.objectContaining({
          email: "test@example.com",
          password: validPassword,
        }),
      );
    });
    await waitFor(() => {
      expect(mockSendVerificationCode).toHaveBeenCalledWith("test@example.com");
      expect(mockNavigate).toHaveBeenCalledWith("/verificationcode", {
        state: { email: "test@example.com" },
      });
      expect(mockToast).toHaveBeenCalledWith({
        variant: "success",
        title: "Account Created",
        description: "A verification code has been sent to your email.",
      });
    });
  });

  it("shows toast if sign up error occurs", async () => {
    signUpState.error = "Account already exists";
    render(
      <MemoryRouter>
        <SignUp />
      </MemoryRouter>,
    );
    fireEvent.change(screen.getByPlaceholderText(/Email/i), {
      target: { value: "test@example.com" },
    });
    const validPassword = "StrongPass1!";
    fireEvent.change(screen.getByPlaceholderText(/Password/i), {
      target: { value: validPassword },
    });
    fireEvent.change(screen.getByPlaceholderText(/First Name/i), {
      target: { value: "John" },
    });
    fireEvent.change(screen.getByPlaceholderText(/Last Name/i), {
      target: { value: "Doe" },
    });
    fireEvent.change(screen.getByPlaceholderText(/Street #, Name/i), {
      target: { value: "123 Main St" },
    });
    fireEvent.change(screen.getByPlaceholderText(/Postal Code/i), {
      target: { value: "12345" },
    });
    fireEvent.change(screen.getByPlaceholderText(/City/i), {
      target: { value: "Anytown" },
    });
    fireEvent.change(screen.getByPlaceholderText(/Prov/i), {
      target: { value: "State" },
    });
    fireEvent.change(screen.getByPlaceholderText(/Country/i), {
      target: { value: "Country" },
    });
    fireEvent.click(screen.getByRole("button", { name: /Sign Up/i }));
    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        variant: "destructive",
        title: "Sign Up Failed",
        description: "Account already exists.",
      });
    });
  });

  it("shows toast if sending verification code fails", async () => {
    mockSignUpUser.mockResolvedValue({ statusCode: 201 });
    sendCodeState.error = "Failed to send code";
    render(
      <MemoryRouter>
        <SignUp />
      </MemoryRouter>,
    );
    fireEvent.change(screen.getByPlaceholderText(/Email/i), {
      target: { value: "test@example.com" },
    });
    const validPassword = "StrongPass1!";
    fireEvent.change(screen.getByPlaceholderText(/Password/i), {
      target: { value: validPassword },
    });
    fireEvent.change(screen.getByPlaceholderText(/First Name/i), {
      target: { value: "John" },
    });
    fireEvent.change(screen.getByPlaceholderText(/Last Name/i), {
      target: { value: "Doe" },
    });
    fireEvent.change(screen.getByPlaceholderText(/Street #, Name/i), {
      target: { value: "123 Main St" },
    });
    fireEvent.change(screen.getByPlaceholderText(/Postal Code/i), {
      target: { value: "12345" },
    });
    fireEvent.change(screen.getByPlaceholderText(/City/i), {
      target: { value: "Anytown" },
    });
    fireEvent.change(screen.getByPlaceholderText(/Prov/i), {
      target: { value: "State" },
    });
    fireEvent.change(screen.getByPlaceholderText(/Country/i), {
      target: { value: "Country" },
    });
    fireEvent.click(screen.getByRole("button", { name: /Sign Up/i }));
    await waitFor(() => {
      expect(mockSendVerificationCode).toHaveBeenCalledWith("test@example.com");
    });
    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        variant: "destructive",
        title: "Verification Code Failed",
        description: "Failed to send verification code. Please try again.",
      });
    });
  });
});
