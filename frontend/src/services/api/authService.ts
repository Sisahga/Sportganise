import log from "loglevel";
import { LoginRequest, LoginResponse } from "@/types/auth";
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
