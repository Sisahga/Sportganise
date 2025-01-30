import log from "loglevel";
import {
  CookiesDto,
  LoginRequest,
  LoginResponse,
  ModifyPasswordRequest,
  ModifyPasswordResponse,
  SendCodeRequest,
  SendCodeResponse,
  SignUpRequest,
  SignUpResponse,
  VerifyCodeRequest,
  VerifyCodeResponse,
} from "@/types/auth";
import { isCookiesDto, setCookies } from "@/services/cookiesService";
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

  const verifyCodeResponse: VerifyCodeResponse = await response.json();
  const cookies: CookiesDto = {
    accountId: verifyCodeResponse.data?.accountId || null,
    firstName: verifyCodeResponse.data?.firstName || "",
    lastName: verifyCodeResponse.data?.lastName || "",
    email: verifyCodeResponse.data?.email || "",
    pictureUrl: verifyCodeResponse.data?.pictureUrl || null,
    type: verifyCodeResponse.data?.type || null,
    phone: verifyCodeResponse.data?.phone || null,
    organisationIds: verifyCodeResponse.data?.organisationIds || [],
    jwtToken: null,
  };
  setCookies(cookies);
  setAuthToken(verifyCodeResponse.data?.jwtToken || "");

  return verifyCodeResponse;
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
