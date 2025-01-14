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
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, error, data, loginUser };
};
