import { useState } from "react";
import waitlistApi from "@/services/api/waitlistApi";
import log from "loglevel";

const useRejectParticipant = () => {
  const [rejecting, setRejecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const rejectParticipant = async (programId: number, accountId: number) => {
    setRejecting(true);
    setError(null);

    try {
      const success = await waitlistApi.rejectParticipant(programId, accountId);

      if (!success) {
        log.error(`Failed to reject participant ${accountId}.`);
        setError(`Failed to reject participant ${accountId}.`);
      } else {
        log.info(`Participant ${accountId} successfully rejected.`);
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
        log.error("Error rejecting participant:", err.message);
      } else {
        setError("An unknown error occurred.");
        log.error("Unknown error rejecting participant.");
      }
    } finally {
      setRejecting(false);
    }
  };

  return { rejectParticipant, rejecting, error };
};

export default useRejectParticipant;
