import { useState } from "react";
import { signUp } from "@/services/api/authAPI";
import { SignUpRequest, SignUpResponse } from "@/types/auth";

export const useSignUp = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data] = useState<SignUpResponse | null>(null);

  const signUpUser = async (requestData: SignUpRequest) => {
    setIsLoading(true);
    setError(null);

    try {
      // Sign Up API call
      const signUpResponse = await signUp(requestData);
      return signUpResponse;
    } catch (err) {
      const errorMessage =
        (err as Error).message || "An unexpected error occured.";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  return { isLoading, error, data, signUpUser };
};
