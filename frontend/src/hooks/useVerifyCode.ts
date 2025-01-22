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
      const response = await verifyCode(requestData);
      setData(response);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, error, data, verifyUserCode };
};
