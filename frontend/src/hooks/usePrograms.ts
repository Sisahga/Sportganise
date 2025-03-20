import { useState, useEffect } from "react";
import { Program } from "@/types/trainingSessionDetails";
import trainingSessionApi from "@/services/api/trainingSessionApi";
import log from "loglevel";

function usePrograms(accountId: number | null) {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [eventDates, setEventDates] = useState<Date[]>([]);

  const fetchPrograms = async (
    accountId: number | null,
    startDate?: Date,
    endDate?: Date
  ) => {
    if (!accountId) {
      console.warn("Skipping fetchPrograms because accountId is null.");
      setPrograms([]); // Prevent UI from breaking
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      log.info("Fetching programs for accountId:", accountId);
      const response = await trainingSessionApi.getPrograms(accountId);

      if (!response || response.statusCode !== 200) {
        throw new Error("Failed to fetch all programs.");
      }

      // Convert `occurrenceDate` to Date objects
      let formattedPrograms = (response.data ?? []).map((program: Program) => ({
        ...program,
        programDetails: {
          ...program.programDetails,

          occurrenceDate:
            typeof program.programDetails.occurrenceDate === "string"
              ? new Date(program.programDetails.occurrenceDate)
              : program.programDetails.occurrenceDate,
        },
      }));

      //If date range is provided, filter programs
      if (startDate && endDate) {
        formattedPrograms = formattedPrograms.filter((program: Program) => {
          const programDate = new Date(program.programDetails.occurrenceDate);
          return programDate >= startDate && programDate <= endDate;
        });
      }

      setPrograms(formattedPrograms ?? []);

      log.info("usePrograms response:", response);
      log.info("usePrograms statusCode:", response.statusCode);
      log.info("usePrograms message:", response.message);
    } catch (err) {
      console.error("Error fetching all programs:", err);
      log.error("Error fetching all programs:", err);
      setError("Failed to fetch all programs.");
    } finally {
      setLoading(false);
    }
  };

  const fetchProgramDates = async (accountId: number | null) => {
    if (!accountId) {
      console.warn("Skipping fetchProgramDates because accountId is null.");
      return;
    }

    try {
      log.info("Fetching program dates for accountId:", accountId);
      const eventDates = await trainingSessionApi.getProgramDates(accountId);
      setEventDates(eventDates ?? []);
    } catch (err) {
      console.error("Error fetching program dates:", err);
      log.error("Error fetching program dates:", err);
      setEventDates([]);
    }
  };

  useEffect(() => {
    async function loadAllEvents() {
      if (accountId) {
        await fetchPrograms(accountId);
        await fetchProgramDates(accountId);
      } else {
        log.warn("Skipping event fetching because accountId is null.");
      }
    }
    loadAllEvents();
  }, [accountId]);

  return {
    programs,
    setPrograms,
    loading,
    setLoading,
    error,
    setError,
    fetchProgramDates,
    eventDates,
    setEventDates,
    fetchPrograms,
  };
}

export default usePrograms;
