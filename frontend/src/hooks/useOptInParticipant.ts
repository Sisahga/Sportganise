import { useState, useCallback } from "react";
import log from "loglevel";
import waitlistParticipantsApi from "@/services/api/programParticipantApi";

const useOptInParticipant = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<number | null>(null);

  const optIn = useCallback(
    async (programId: number, accountId: number | undefined) => {
      setLoading(true);
      setError(null);
      try {
        const dataOpt = await waitlistParticipantsApi.optIn(
          programId,
          accountId,
        );
        setData(dataOpt);
        log.info("Participant opted in to waitlist.");
        console.log("Participant information: ", dataOpt);
      } catch (err) {
        let errorMessage =
          "An error occurred while opting participant into waitlist.";
        if (err instanceof Error) {
          errorMessage = err.message;
        } else if (typeof err === "string") {
          errorMessage = err;
        }
        setError(errorMessage);
        log.error("Error opting in user into waitlist:", err);
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
    optIn,
  };
};

export default useOptInParticipant;
