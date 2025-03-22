import { useState } from "react";
import waitlistApi from "@/services/api/waitlistApi";
import log from "loglevel";
import { Attendees } from "@/types/trainingSessionDetails";

const useConfirmParticipant = () => {
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successData, setSuccessData] = useState<Attendees | null>(null);

  const confirmParticipant = async (programId: number, accountId: number) => {
    setConfirming(true);
    setError(null);

    try {
      const success = await waitlistApi.confirmParticipant(
        programId,
        accountId,
      );

      setSuccessData(success);
      log.info("Participant confirmed successfully.");
      console.log("Participant information: ", success);
    } catch (err: unknown) {
      let errorMessage = "An error occurred while marking participant absent.";
      if (err instanceof Error) {
        errorMessage = err.message;
      } else if (typeof err === "string") {
        errorMessage = err;
      }
      setError(errorMessage);
      log.error("Error marking participant absent:", err);
    } finally {
      setConfirming(false);
    }
  };

  return { confirmParticipant, confirming, error, successData };
};

export default useConfirmParticipant;
