// for managing the login process :
// provides state management for handling the login API call, including loading state,
// error handling, and storing the response.

import log from "loglevel";
import { useState } from "react";
import { login } from "@/services/api/authAPI";
import { LoginRequest, CookiesDto } from "@/types/auth";
import { isCookiesDto } from "@/services/cookiesService";
import ResponseDto from "@/types/response.ts";

export const useLogin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<ResponseDto<CookiesDto> | null>(null);

  const loginUser = async (requestData: LoginRequest) => {
    setIsLoading(true);
    setError(null);

    try {
      log.info("Starting login process...");
      const response = await login(requestData);
      setData(response);

      if (response.data && isCookiesDto(response.data)) {
        log.info("CookiesDto successfully processed during login.");
      } else {
        log.warn("Login response does not include a valid CookiesDto.");
      }
    } catch (err) {
      const errorMessage =
        (err as Error).message || "An unexpected error occurred.";
      log.error(`Error during login: ${errorMessage}`);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
      log.info("Login process completed.");
    }
  };

  return { isLoading, error, data, loginUser };
};
