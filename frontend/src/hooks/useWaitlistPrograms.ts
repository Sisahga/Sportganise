import { useState, useCallback } from "react";
import log from "loglevel";
import { ProgramDetails } from "@/types/trainingSessionDetails";
import programParticipantApi from "@/services/api/programParticipantApi";

const useWaitlistPrograms = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<ProgramDetails[] | null>(null);

  const waitlistPrograms = useCallback(async (accountId: number) => {
    setLoading(true);
    setError(null);
    try {
      const dataWaitlist =
        await programParticipantApi.waitlistPrograms(accountId);
      setData(dataWaitlist);
      log.info("Waitlist programs fetched succesfully.");
      console.log("Participant information: ", dataWaitlist);
    } catch (err) {
      let errorMessage = "An error occurred while fetching waitlist programs.";
      if (err instanceof Error) {
        errorMessage = err.message;
        console.log(errorMessage);
      } else if (typeof err === "string") {
        errorMessage = err;
        console.log(errorMessage);
      }
      setError(errorMessage);
      log.error("Error fetching waitlist programs:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    data,
    waitlistPrograms,
  };
};

export default useWaitlistPrograms;
