import { useState, useEffect } from "react";
import { Program } from "@/types/trainingSessionDetails";
import waitlistApi from "@/services/api/waitlistApi";
import log from "loglevel";

function useWaitlistPrograms() {
  const [waitlistPrograms, setWaitlistPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWaitlistPrograms = async () => {
    try {
      const data = await waitlistApi.getWaitlistPrograms(); // Using the waitlist API now
      setWaitlistPrograms(data ?? []);
      log.info("useWaitlistPrograms response:", data);
    } catch (err) {
      console.error("Error fetching waitlist programs:", err);
      setError("Failed to fetch waitlist programs.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWaitlistPrograms();
  }, []);

  return {
    waitlistPrograms,
    loading,
    error,
  };
}

export default useWaitlistPrograms;
