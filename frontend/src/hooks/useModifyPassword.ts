import { useState } from "react";
import { modifyPassword } from "@/services/api/authAPI";
import { ModifyPasswordRequest } from "@/types/auth";
import log from "loglevel";

const useModifyPassword = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [Message, setMessage] = useState<string | null>(null);

  const modifyPasswordHandler = async (data: ModifyPasswordRequest) => {
    log.debug("Starting password modification with data:", data);
    setIsLoading(true);
    setError(false);
    setSuccess(false);
    setMessage(null);

    try {
      const result = await modifyPassword(data);
      setSuccess(true);
      setMessage(result.message);
      log.info("Password modification successful:", result.message);
    } catch (err) {
      log.error("Error during password modification:", err);
      setError(true);
      if (err instanceof Error) {
        setMessage(err.message);
      } else {
        setMessage("Failed to change password. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    Message,
    success,
    error,
    modifyPassword: modifyPasswordHandler,
  };
};

export default useModifyPassword;
