import ResponseDto from "@/types/response";
import trainingSessionApi from "@/services/api/trainingSessionApi";
import log from "loglevel";
import { ProgramDetails } from "@/types/trainingSessionDetails";
import { useState } from "react";

function useModifyTrainingSession() {
  const [data, setData] = useState<ResponseDto<ProgramDetails> | null>();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const modifyTrainingSession = async (
    accountId: number,
    programId: number,
    formValues: FormData
  ) => {
    try {
      const response = await trainingSessionApi.modifyTrainingSession(
        accountId,
        programId,
        formValues
      );
      setData(response);

      if (response.statusCode !== 200) {
        throw new Error("Failed to modify training session.");
      }

      log.info("useModifyPrograms data:", data);
      log.info("useModifyPrograms statusCode:", response.statusCode);
      log.info("useModifyPrograms message:", response.message);
      console.log("useModifyPrograms : response ", response);
    } catch (err) {
      console.error("Error modifying training sessions:", err);
      log.error("Error modifying training sessions:", err);
      setLoading(false);
      setError("Failed to modify training session.");
      return null;
    }
  };
  return {
    loading,
    error,
    modifyTrainingSession,
    data,
  };
}

export default useModifyTrainingSession;
