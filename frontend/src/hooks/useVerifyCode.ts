import { useState } from "react";
import { verifyCode } from "@/services/api/authAPI";
import { VerifyCodeRequest, VerifyCodeResponse } from "@/types/auth";

export const useVerifyCode = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<VerifyCodeResponse | null>(null);

  const verifyUserCode = async (requestData: VerifyCodeRequest) => {
    setIsLoading(true);
    setError(null);

    try {
      console.log("Sending request to verify code:", requestData);
      const verifyCodeResponse = await verifyCode(requestData);
      console.log("Response from verify-code API:", verifyCodeResponse);
      setData(verifyCodeResponse);
      return verifyCodeResponse;
    } catch (err) {
      const errorMessage =
        (err as Error).message || "An unexpected error occured.";
      setError(errorMessage);
      console.error("Error verifying code:", errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, error, data, verifyUserCode };
};
