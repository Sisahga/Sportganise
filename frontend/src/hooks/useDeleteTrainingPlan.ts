import trainingPlanApi from "@/services/api/trainingPlanApi";
import ResponseDto from "@/types/response";
import { DeleteTrainingPlanDto } from "@/types/trainingplans";
import log from "loglevel";

function useDeleteTrainingPlan() {
  const deleteTrainingPlan = async (
    userId: number | null | undefined,
    planId: number
  ) => {
    try {
      const data: ResponseDto<DeleteTrainingPlanDto> =
        await trainingPlanApi.deleteTrainingPlan(userId, planId);
      if (data.statusCode !== 200) {
        log.error(
          `useDeleteTrainingPlan.deleteTrainingPlan -> Errow thrown! ${data.message}`
        );
        throw new Error(data.message);
      }
      return data;
    } catch (err) {
      throw err;
    }
  };
  return {
    deleteTrainingPlan,
  };
}

export default useDeleteTrainingPlan;
