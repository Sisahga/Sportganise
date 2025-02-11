import trainingPlanApi from "@/services/api/trainingPlanApi";
import ResponseDto from "@/types/response";
import { DeleteTrainingPlanDto } from "@/types/trainingplans";

function useDeleteTrainingPlan() {
  const deleteTrainingPlan = async (
    userId: number | null | undefined,
    planId: number
  ) => {
    try {
      const data: ResponseDto<DeleteTrainingPlanDto> =
        await trainingPlanApi.deleteTrainingPlan(userId, planId);
      if (data.statusCode !== 200) {
        throw new Error(
          "useDeleteTrainingPlan.deleteTrainingPlan -> Errow thrown!"
        );
      }
      return data;
    } catch (err) {
      return null;
    }
  };
  return {
    deleteTrainingPlan,
  };
}

export default useDeleteTrainingPlan;
