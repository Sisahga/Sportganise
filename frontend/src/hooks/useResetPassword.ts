import { useState } from "react";
import { resetPassword as resetPasswordService } from "@/services/api/authAPI";

export const useResetPassword = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const resetPassword = async (email: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await resetPasswordService(email);
      return response;
    } catch (err) {
      const errorMessage =
        (err as Error).message || "An unexpected error occurred.";

      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return { resetPassword, isLoading, error };
};
