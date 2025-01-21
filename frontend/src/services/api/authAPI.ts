import log from "loglevel";
import {
  LoginRequest,
  LoginResponse,
  SignUpRequest,
  SignUpResponse,
  SendCodeRequest,
  SendCodeResponse,
  VerifyCodeRequest,
  VerifyCodeResponse,
} from "@/types/auth";
import { setCookies, isCookiesDto } from "@/services/cookiesService";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const login = async (data: LoginRequest): Promise<LoginResponse> => {
  const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorResponse = await response.text(); // Read error response
    throw new Error(errorResponse || `HTTP error! status: ${response.status}`);
  }

  const loginResponse: LoginResponse = await response.json();

  if (loginResponse.data && isCookiesDto(loginResponse.data)) {
    setCookies(loginResponse.data);
  } else {
    log.warn("No cookies data found in login response");
  }

  return loginResponse; // Parse response as JSON
};

export const signUp = async (data: SignUpRequest): Promise<SignUpResponse> => {
  const response = await fetch(`${API_BASE_URL}/api/auth/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  console.log("Raw response:", response);

  if (!response.ok) {
    const errorResponse = await response.text();
    throw new Error(errorResponse || `HTTP error! status: ${response.status}`);
  }

  return await response.json();
};

export const sendCode = async (
  data: SendCodeRequest,
): Promise<SendCodeResponse> => {
  const response = await fetch(`${API_BASE_URL}/api/auth/send-code`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorResponse = await response.text();
    throw new Error(errorResponse || `HTTP error! status: ${response.status}`);
  }
  return await response.json();
};

export const verifyCode = async (
  data: VerifyCodeRequest,
): Promise<VerifyCodeResponse> => {
  const response = await fetch(`${API_BASE_URL}/api/auth/verify-code`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorResponse = await response.text();
    throw new Error(errorResponse || `HTTP error! status: ${response.status}`);
  }

  return await response.json();
};
