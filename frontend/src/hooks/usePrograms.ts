import { useState, useEffect } from "react";
import { Program } from "@/types/trainingSessionDetails";
import trainingSessionApi from "@/services/api/trainingSessionApi";
import log from "loglevel";

function usePrograms(accountId: number | null | undefined) {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null); //either exists or does not

  const fetchPrograms = async () => {
    try {
      const response = await trainingSessionApi.getPrograms(accountId);
      setPrograms(response.data ?? []); // else returns empty array of Programs (Program[])

      if (response.statusCode !== 200) {
        throw new Error("Failed to fetch all programs.");
      }

      log.info("usePrograms response:", response);
      log.info("usePrograms statusCode:", response.statusCode);
      log.info("usePrograms message:", response.message);
      console.log(
        "usePrograms : const programs = useState<Program[]> => ",
        programs,
      );
    } catch (err) {
      console.error("Error fetching all programs:", err);
      log.error("Error fetching all programs:", err);
      setError("Failed to fetch all programs.");
    }
  };

  useEffect(() => {
    fetchPrograms().then(() => {
      setLoading(false);
    });
  }, []);

  return {
    programs, //returns Program[] or empty array []
    setPrograms,
    loading,
    error,
  };
}

export default usePrograms;
