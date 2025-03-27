import { useState } from "react";
import trainingSessionApi from "@/services/api/trainingSessionApi";

const useDeleteProgram = () => {
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isDeleted, setIsDeleted] = useState<boolean>(false);

  const deleteProgram = async (
    accountId: number | null | undefined,
    programId: number,
  ) => {
    if (!accountId || !programId) {
      setError("Invalid account ID or program ID.");
      return;
    }

    setIsDeleting(true);
    setError(null);
    setIsDeleted(false);

    try {
      const response = await trainingSessionApi.deleteProgram(
        accountId,
        programId,
      );
      setIsDeleted(true);
      return response;
    } catch (error) {
      console.log(error);
      setError("Failed to delete program.");
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    isDeleting,
    error,
    isDeleted,
    deleteProgram,
  };
};

export default useDeleteProgram;
