import { useState } from "react";
import programParticipantApi from "@/services/api/programParticipantApi";
import { Attendees } from "@/types/trainingSessionDetails";

interface RSVPParams {
  programId: number;
  accountId: number;
  visibility: string;
}

const useRSVP = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<Attendees | null>(null);

  const rsvp = async ({
    programId,
    accountId,
    visibility,
  }: RSVPParams): Promise<Attendees> => {
    setIsLoading(true);
    console.log("RSVP HOOK: Starting RSVP...");
    try {
      // Try to get existing participant
      let existingParticipant: Attendees | null = null;
      try {
        existingParticipant = await programParticipantApi.getProgramParticipant(
          programId,
          accountId,
        );
        console.log("Existing participant found: ", existingParticipant);
      } catch (err: any) {
        console.warn("No existing participant found. Could be uninvited.");
      }

      const isPrivate = visibility.toLowerCase() === "private";

      if (isPrivate && !existingParticipant) {
        console.warn("Cannot RSVP to private event without invite.");
        throw new Error("You were not invited to this private event.");
      }

      // Force RSVP attempt — don't trust backend's confirmed:true
      const success = await programParticipantApi.rsvpToProgram({
        programId,
        accountId,
      });

      if (!success) throw new Error("RSVP failed");

      const updated = await programParticipantApi.getProgramParticipant(
        programId,
        accountId,
      );

      setData(updated);
      return updated;
    } catch (err: any) {
      const errorMessage = err?.message || "RSVP failed";
      console.error("RSVP HOOK Error:", errorMessage);
      throw new Error(errorMessage);
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
