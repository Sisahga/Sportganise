import { useState, useEffect } from "react";
import { Program } from "@/types/trainingSessionDetails";
import waitlistApi from "@/services/api/waitlistApi";
import log from "loglevel";

function useWaitlistPrograms() {
  const [waitlistPrograms, setWaitlistPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log(
      "useWaitlistPrograms: Retrieved waitlist programs:",
      waitlistPrograms,
    );
  }, [waitlistPrograms]);

  const fetchWaitlistPrograms = async () => {
    try {
      const response = await waitlistApi.getWaitlistPrograms();
      console.log("Raw response from getWaitlistPrograms:", response);
      setWaitlistPrograms(response ?? []);
      log.info("useWaitlistPrograms response:", response);
    } catch (err) {
      console.error("Error fetching waitlist programs:", err);
      setError(`Failed to fetch waitlist programs: ${err}`);
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
