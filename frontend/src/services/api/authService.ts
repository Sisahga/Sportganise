import { LoginRequest, LoginResponse } from "@/types/auth";

const API_BASE_URL = "/api/auth"; // Your API base URL

export const login = async (data: LoginRequest): Promise<LoginResponse> => {
  const response = await fetch(`${API_BASE_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  console.log("Raw response:", response); // Debug: Check raw response
  console.log("Response status:", response.status); // Debug: Check HTTP status

  if (!response.ok) {
    // Handle non-200 HTTP status codes
    const errorResponse = await response.text(); // Read response as text to avoid JSON parsing errors
    throw new Error(errorResponse || `HTTP error! status: ${response.status}`);
  }

  try {
    const jsonResponse = await response.json();
    console.log("JSON response:", jsonResponse); // Debug: Log parsed JSON
    return jsonResponse;
  } catch (err) {
    console.error("JSON parsing error:", err); // Debug: Log parsing error
    throw new Error("Invalid JSON response from server");
  }
};
