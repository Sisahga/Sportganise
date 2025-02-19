import { useState } from "react";
import waitlistApi from "@/services/api/waitlistApi";
import log from "loglevel";

const useConfirmParticipant = () => {
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const confirmParticipant = async (programId: number, accountId: number) => {
    setConfirming(true);
    setError(null);

    try {
      const success = await waitlistApi.confirmParticipant(
        programId,
        accountId,
      );

      if (!success) {
        log.error(`Failed to confirm participant ${accountId}.`);
        setError(`Failed to confirm participant ${accountId}.`);
      } else {
        log.info(`Participant ${accountId} successfully confirmed.`);
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
        log.error("Error confirming participant:", err.message);
      } else {
        setError("An unknown error occurred.");
        log.error("Unknown error confirming participant.");
      }
    } finally {
      setConfirming(false);
    }
  };

  return { confirmParticipant, confirming, error };
};

export default useConfirmParticipant;
