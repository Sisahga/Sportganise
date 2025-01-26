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
  CookiesDto,
  ModifyPasswordRequest,
  ModifyPasswordResponse,
} from "@/types/auth";
import { setCookies, isCookiesDto } from "@/services/cookiesService";
import { setAuthToken } from "@/services/apiHelper.ts";

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
    setAuthToken(loginResponse.data.jwtToken || "");
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

  const signUpResponse: SignUpResponse = await response.json();
  const cookies: CookiesDto = {
    accountId: signUpResponse.data?.accountId || null,
    firstName: signUpResponse.data?.firstName || "",
    lastName: signUpResponse.data?.lastName || "",
    email: signUpResponse.data?.email || "",
    pictureUrl: signUpResponse.data?.pictureUrl || null,
    type: signUpResponse.data?.type || null,
    phone: signUpResponse.data?.phone || null,
    organisationIds: signUpResponse.data?.organisationIds || [],
    jwtToken: null,
  };
  setCookies(cookies);
  setAuthToken(signUpResponse.data?.jwtToken || "");

  return signUpResponse;
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

export const modifyPassword = async (
  data: ModifyPasswordRequest,
): Promise<ModifyPasswordResponse> => {
  const response = await fetch(`${API_BASE_URL}/api/auth/modify-password`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorResponse = await response.json(); // Parse the response as JSON
    throw new Error(
      errorResponse.message || `HTTP error! status: ${response.status}`,
    );
  }
  return await response.json();
};
