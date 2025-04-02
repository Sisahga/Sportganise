import { useState, useEffect } from "react";
import programParticipantApi from "@/services/api/programParticipantApi";
import { Attendees } from "@/types/trainingSessionDetails";

const useGetParticipant = (
  programId: number,
  accountId: number | null | undefined
) => {
  const [data, setData] = useState<Attendees | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Only fetch if a valid programId and accountId are provided
    if (programId && accountId !== null && accountId !== undefined) {
      setLoading(true);
      programParticipantApi
        .getProgramParticipant(programId, accountId)
        .then((result) => {
          setData(result);
          setError(null);
        })
        .catch((err) => {
          setError(err.message || "An error occurred");
          setData(null);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [programId, accountId]);

  return { data, loading, error };
};

export default useGetParticipant;
