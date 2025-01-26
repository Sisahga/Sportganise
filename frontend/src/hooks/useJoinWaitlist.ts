import { useState } from "react";

const useJoinWaitlist = () => {
  const [joining, setJoining] = useState(false);
  const [userRank, setUserRank] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const joinQueue = async (programId: number, accountId: number) => {
    setJoining(true);
    setError(null);

    try {
      const response = await fetch(`/program-participant/opt-participant`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ programId, accountId }),
      });

      if (!response.ok) {
        throw new Error(`Failed to join queue: ${response.statusText}`);
      }

      const data = await response.json();
      setUserRank(data.rank);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setJoining(false);
    }
  };

  return { joinQueue, joining, userRank, error };
};

export default useJoinWaitlist;
