import { useState, useCallback } from "react";
import programParticipantApi from "@/services/api/programParticipantApi";
import { Attendees } from "@/types/trainingSessionDetails";

const useGetParticipant = (
  programId: number,
  accountId: number | null | undefined,
) => {
  const [data, setData] = useState<Attendees | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchParticipant = useCallback(async () => {
    if (programId && accountId !== null && accountId !== undefined) {
      setLoading(true);
      try {
        const result = await programParticipantApi.getProgramParticipant(
          programId,
          accountId,
        );
        setData(result);
        setError(null);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred");
        }
        setData(null);
      } finally {
        setLoading(false);
      }
    }
  }, [programId, accountId]);

  return { data, loading, error, fetchParticipant };
};

export default useGetParticipant;
