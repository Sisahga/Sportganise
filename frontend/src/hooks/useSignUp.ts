import { useState } from "react";
import { signUp } from "@/services/api/authAPI";
import { SignUpRequest, SignUpResponse } from "@/types/auth";

export const useSignUp = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<SignUpResponse | null>(null);
  const [emailForVerification, setEmailForVerification] = useState<
    string | null
  >(null);

  const signUpUser = async (requestData: SignUpRequest) => {
    setIsLoading(true);
    setError(null);

    try {
      // Sign Up API call
      const signUpResponse = await signUp(requestData);
      setData(signUpResponse);

      // Save email for verification if sign-up is successful
      setEmailForVerification(requestData.email);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };
  return { isLoading, error, data, emailForVerification, signUpUser };
};
