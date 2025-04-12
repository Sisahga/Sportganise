import programParticipantApi from "@/services/api/programParticipantApi.ts";
import log from "loglevel";
import { DetailedProgramParticipantDto } from "@/types/trainingSessionDetails.ts";
import { useCallback, useEffect, useState } from "react";

const useGetDetailedProgramParticipants = (programId: number) => {
  const [participants, setParticipants] = useState<
    DetailedProgramParticipantDto[]
  >([]);
  const [loadingParticipants, setLoadingParticipants] = useState(true);
  const getDetailedProgramParticipants = useCallback(async () => {
    setLoadingParticipants(true);
    const response =
      await programParticipantApi.getCoachAndWaitlistedParticipants(programId);

    if (response.statusCode === 200 && response.data) {
      setParticipants(response.data);
    } else if (response.statusCode === 200 && !response.data) {
      log.error("No data found for program participants");
      throw new Error("No data found for program participants");
    } else {
      log.error("Error fetching program participants: ", response);
      throw new Error(
        `Error fetching program participants: ${response.statusCode} - ${response.message}`,
      );
    }
    setLoadingParticipants(false);
  }, []);

  const fetchRefreshedData = useCallback(async () => {
    const updated_res =
      await programParticipantApi.getCoachAndWaitlistedParticipants(programId);
    if (updated_res.statusCode === 200 && updated_res.data) {
      setParticipants(updated_res.data);
      return updated_res.data;
    } else if (updated_res.statusCode === 200 && !updated_res.data) {
      log.error("No data found for program participants");
      throw new Error("No data found for program participants");
    } else {
      log.error("Error fetching program participants: ", updated_res);
      throw new Error(
        `Error fetching program participants: ${updated_res.statusCode} - ${updated_res.message}`,
      );
    }
  }, [programId]);

  useEffect(() => {
    getDetailedProgramParticipants().then((_) => _);
  }, [programId]);
  return {
    participants,
    loadingParticipants,
    fetchRefreshedData,
  };
};
export default useGetDetailedProgramParticipants;
