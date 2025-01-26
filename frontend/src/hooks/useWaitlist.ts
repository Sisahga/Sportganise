import { useState, useEffect } from "react";
import waitlistApi from "@/services/api/waitlistApi";
import { WaitlistParticipant } from "@/types/waitlistParticipant";

export function useWaitlist(programId: number) {
  const [waitlist, setWaitlist] = useState<WaitlistParticipant[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWaitlist = async () => {
      setLoading(true);
      try {
        const data = await waitlistApi.getWaitlist(programId);
        setWaitlist(data);
      } catch (err) {
        setError("Failed to fetch waitlist.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchWaitlist();
  }, [programId]);

  return { waitlist, loading, error };
}
