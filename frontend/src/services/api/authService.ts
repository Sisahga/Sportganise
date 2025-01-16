import { LoginRequest, LoginResponse } from "@/types/auth";

const API_BASE_URL = "http://localhost:8080"; // API base URL

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

  return response.json(); // Parse response as JSON
};
