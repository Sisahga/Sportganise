import { useState } from "react";
import { resetPassword } from "@/services/api/authAPI";
import { ResetPasswordRequest } from "@/types/auth";
import log from "loglevel";

const useResetPassword = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const resetPasswordHandler = async (data: ResetPasswordRequest) => {
    log.debug("Starting password reset with data:", data);
    setIsLoading(true);
    setError(false);
    setSuccess(false);
    setMessage(null);

    try {
      const result = await resetPassword(data);
      setSuccess(true);
      setMessage(result.message);
      log.info("Password reset successful:", result.message);
    } catch (err) {
      log.error("Error during password reset:", err);
      setError(true);
      if (err instanceof Error) {
        setMessage(err.message);
      } else {
        setMessage("Failed to reset password. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    message,
    success,
    error,
    resetPassword: resetPasswordHandler,
  };
};

export default useResetPassword;
