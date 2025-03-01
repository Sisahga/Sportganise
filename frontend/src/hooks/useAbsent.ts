import { useState, useCallback } from "react";
import { Attendees } from "@/types/trainingSessionDetails";
import log from "loglevel";
import waitlistParticipantsApi from "@/services/api/waitlistParticipantsApi";

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
      } catch (err: any) {
        setError(err.message); // Set error state
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
