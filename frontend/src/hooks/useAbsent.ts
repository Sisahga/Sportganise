import { useState, useCallback } from "react";
import { Attendees } from "@/types/trainingSessionDetails";
import log from "loglevel";
import waitlistParticipantsApi from "@/services/api/programParticipantApi";

const useAbsent = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<Attendees | null>(null);

  const markAbsent = useCallback(
    async (programId: number, accountId: number | null | undefined) => {
      setLoading(true);
      setError(null);
      try {
        const dataAbsent = await waitlistParticipantsApi.markAbsent(
          programId,
          accountId,
        );
        setData(dataAbsent);
        log.info("Participant marked absent successfully.");
        console.log("Participant information: ", dataAbsent);
      } catch (err) {
        let errorMessage =
          "An error occurred while marking participant absent.";
        if (err instanceof Error) {
          errorMessage = err.message;
        } else if (typeof err === "string") {
          errorMessage = err;
        }
        setError(errorMessage);
        log.error("Error marking participant absent:", err);
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  return {
    loading,
    error,
    data,
    markAbsent,
  };
};

export default useAbsent;
