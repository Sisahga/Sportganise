// for managing the login process :
// provides state management for handling the login API call, including loading state,
// error handling, and storing the response.

import { useState } from "react";
import { login } from "@/services/api/authService";
import { LoginRequest, LoginResponse } from "@/types/auth";

export const useLogin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<LoginResponse | null>(null);

  const loginUser = async (requestData: LoginRequest) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await login(requestData);
      setData(response);
    } catch (err) {
      setError((err as Error).message || "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, error, data, loginUser };
};
