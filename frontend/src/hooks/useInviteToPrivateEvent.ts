import { useState } from "react";
import programParticipantApi from "../services/api/programParticipantApi";
import log from "loglevel";

export const useInviteToPrivateEvent = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const invite = async (
    accountId: number,
    programId: number | null | undefined,
  ) => {
    setLoading(true);
    setError(null);

    try {
      const response = await programParticipantApi.inviteToPrivateEvent(
        accountId,
        programId,
      );
      log.info("Successfully invited to private event:", response);
      console.log("Successfully invited to private event:", response);
      return response;
    } catch (err) {
      log.error("Failed to invite to private event:", err);
      console.log("Failed to invite to private event:", err);
      setError((err as Error).message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { invite, loading, error };
};
