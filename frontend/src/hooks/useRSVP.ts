import { useState } from "react";
import programParticipantApi from "@/services/api/programParticipantApi";
import { Attendees } from "@/types/trainingSessionDetails";

interface RSVPParams {
  programId: number;
  accountId: number;
}

const useRSVP = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<Attendees | null>(null);

  const rsvp = async ({
    programId,
    accountId,
  }: RSVPParams): Promise<Attendees> => {
    setIsLoading(true);

    try {
      console.log("Calling RSVP with:", { programId, accountId });

      // Proceed to RSVP
      const success = await programParticipantApi.rsvpToProgram({
        programId,
        accountId,
      });
      if (!success) throw new Error("RSVP failed");

      // Re-fetch the newly updated participant data
      const updated = await programParticipantApi.getProgramParticipant(
        programId,
        accountId
      );

      setData(updated);
      return updated;
    } catch (err: any) {
      const errorMessage = err?.message || "RSVP failed";
      console.error("RSVP error:", errorMessage);
      //setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const reset = () => {
    setData(null);
  };

  return { rsvp, isLoading, data, reset };
};

export default useRSVP;
