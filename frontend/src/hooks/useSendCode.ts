import { useState } from "react";
import { sendCode } from "@/services/api/authAPI";
import { SendCodeRequest, SendCodeResponse } from "@/types/auth";

export const useSendCode = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data] = useState<SendCodeResponse | null>(null);

  const sendVerificationCode = async (email: string) => {
    if (!email) {
      setError("Email is required to send the verification code.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const request: SendCodeRequest = { email };
      const sendCodeResponse = await sendCode(request); // Send code API call
      return sendCodeResponse;
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, error, data, sendVerificationCode };
};
