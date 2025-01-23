import { useState, useEffect } from "react";
import { sendCode } from "@/services/api/authAPI";
import { SendCodeRequest, SendCodeResponse } from "@/types/auth";

export const useSendCode = (emailForVerification: string | null) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<SendCodeResponse | null>(null);

  useEffect(() => {
    const sendVerificationCode = async () => {
      if (!emailForVerification) return; // Only send if the email is set
      setIsLoading(true);
      setError(null);

      try {
        const request: SendCodeRequest = { email: emailForVerification };
        const response = await sendCode(request); // Send code API call
        setData(response);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setIsLoading(false);
      }
    };

    sendVerificationCode();
  }, [emailForVerification]);

  return { isLoading, error, data };
};
