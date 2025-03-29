import { useState } from "react";
import waitlistApi from "@/services/api/waitlistApi";

const useJoinWaitlist = () => {
  const [joining, setJoining] = useState(false);
  const [userRank, setUserRank] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const joinQueue = async (programId: number, accountId: number) => {
    setJoining(true);
    setError(null);

    try {
      const rank = await waitlistApi.joinQueue(programId, accountId);
      setUserRank(rank);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred.");
      }
    } finally {
      setJoining(false);
    }
  };

  return { joinQueue, joining, userRank, error };
};

export default useJoinWaitlist;
