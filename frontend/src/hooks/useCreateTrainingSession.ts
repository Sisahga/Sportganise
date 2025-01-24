import trainingSessionApi from "@/services/api/trainingSessionApi";
//import { FormValues } from "@/types/trainingSessionFormValues";
import { useState } from "react";
import log from "loglevel";

function useCreateTrainingSession() {
  //const [data, setData] = useState<ResponseFormValues>();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const createTrainingSession = async (
    accountId: number | null | undefined,
    jsonPayload: FormData
  ) => {
    try {
      log.info("------- IN useCreateTrainingSession.tsx!");
      const data = await trainingSessionApi.createTrainingSession(
        accountId,
        jsonPayload
      );
      console.log("DATA IN USECREATE:", data);
      if (data.statusCode === 201) {
        console.log("Response data: ", data.message, data);
        log.info("Response data: ", data.message, data);
        setLoading(false);
      } else {
        throw new Error("Error thrown in useCreateTrainingSession!");
      }
      return data;
    } catch (err) {
      console.error("useCreateTrainingSession (err)", err);
      log.error("useCreateTrainingSession (err)", err);
      setError(
        "The training session encounterred an error and could not be created!"
      );
      log.info(
        "error in useCreateTrainingSession.createTrainingSession so return null."
      );
      log.info("------- END OF useCreateTrainingSession.createTrainingSession");
      return null;
    }
  };
  log.info("------- END OF useCreateTrainingSession.createTrainingSession");
  return {
    createTrainingSession,
    error,
    loading,
  };
}

export default useCreateTrainingSession;
