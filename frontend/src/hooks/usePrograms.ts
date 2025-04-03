import { useState, useCallback } from "react";
import { Program } from "@/types/trainingSessionDetails";
import trainingSessionApi from "@/services/api/trainingSessionApi";
import log from "loglevel";

function usePrograms() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [eventDates, setEventDates] = useState<Date[]>([]);

  const fetchPrograms = useCallback(
    async (accountId: number | null, startDate?: Date, endDate?: Date) => {
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
        let formattedPrograms = (response.data ?? []).map(
          (program: Program) => ({
            ...program,
            programDetails: {
              ...program.programDetails,

              occurrenceDate:
                typeof program.programDetails.occurrenceDate === "string"
                  ? new Date(program.programDetails.occurrenceDate)
                  : program.programDetails.occurrenceDate,
            },
          })
        );

        //If date range is provided, filter programs
        if (startDate && endDate) {
          formattedPrograms = formattedPrograms.filter((program: Program) => {
            const programDate = new Date(program.programDetails.occurrenceDate);
            return programDate >= startDate && programDate <= endDate;
          });
        }

        // Compare formatted programs, not raw response
        const incoming = JSON.stringify(formattedPrograms);
        const existing = JSON.stringify(programs);
        if (incoming !== existing) {
          setPrograms(formattedPrograms);
        }

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
    },
    [programs]
  );

  const fetchProgramDates = useCallback(async (accountId: number | null) => {
    if (!accountId) {
      console.warn("Skipping fetchProgramDates because accountId is null.");
      return;
    }

    //Normalize dates to midnight
    function normalizeToStartOfDay(date: Date): Date {
      return new Date(date.getFullYear(), date.getMonth(), date.getDate());
    }
    try {
      log.info("Fetching full programs to extract recurrence dates...");
      const response = await trainingSessionApi.getPrograms(accountId);

      if (!response?.data || !Array.isArray(response.data)) {
        console.error("Invalid program response format.");
        setEventDates([]);
        return;
      }

      const programs: Program[] = response.data;
      const expandedDates: Date[] = [];

      for (const program of programs) {
        const { occurrenceDate, reccurenceDate, frequency } =
          program.programDetails;

        const start = normalizeToStartOfDay(new Date(occurrenceDate));
        const endRaw = new Date(reccurenceDate ?? occurrenceDate);
        endRaw.setDate(endRaw.getDate() + 1); //ensures inclusion of last day
        const end = normalizeToStartOfDay(endRaw);
        const freq = frequency?.toLowerCase?.() ?? "once";

        console.log("Expanding program:", {
          title: program.programDetails.title,
          start: start.toDateString(),
          end: end.toDateString(),
          freq,
        });

        if (!frequency) {
          console.warn("Missing frequency in program:", program);
        }

        if (["daily", "weekly", "biweekly", "monthly"].includes(freq)) {
          let current = new Date(start);
          while (current.getTime() <= end.getTime()) {
            expandedDates.push(new Date(current)); // clone before mutation

            switch (freq) {
              case "daily":
                current.setDate(current.getDate() + 1);
                break;
              case "weekly":
                current.setDate(current.getDate() + 7);
                break;
              case "biweekly":
                current.setDate(current.getDate() + 14);
                break;
              case "monthly":
                current.setMonth(current.getMonth() + 1);
                break;
            }
          }
        } else {
          expandedDates.push(start); // one-time events
        }
      }

      console.log(
        "Expanded event dates:",
        expandedDates.map((d) => d.toDateString())
      );
      setEventDates(expandedDates);
    } catch (err) {
      console.error("Error fetching program dates:", err);
      log.error("Error fetching program dates:", err);
      setEventDates([]);
    }
  }, []);

  log.info("usePrograms initialized only once");

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
