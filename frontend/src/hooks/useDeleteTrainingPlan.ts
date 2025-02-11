import trainingPlanApi from "@/services/api/trainingPlanApi";
import ResponseDto from "@/types/response";
import { DeleteTrainingPlanDto } from "@/types/trainingplans";
import log from "loglevel";

/**
 * Deletes a selected training plan.
 *
 * @param userId
 * @param planId
 * @returns useDeleteTrainingPlan()
 */
function useDeleteTrainingPlan() {
  // Delete A Selected Training Plan
  const deleteTrainingPlan = async (
    userId: number | null | undefined,
    planId: number
  ) => {
    // Call Api Endpoint
    const data: ResponseDto<DeleteTrainingPlanDto> =
      await trainingPlanApi.deleteTrainingPlan(userId, planId);
    // Handle HTTP StatusCode
    if (data.statusCode !== 200) {
      log.error(
        `useDeleteTrainingPlan.deleteTrainingPlan -> Errow thrown! ${data.message}`
      );
      throw new Error(data.message); // Throw Dto message to error toast in ConfirmationDialog
    }
    log.info("useDeleteTrainingPlan.deleteTrainingPlan -> data is", data);
    return data; // Return sucess
  };
  return {
    deleteTrainingPlan, // Accessable outside top level
  };
}

export default useDeleteTrainingPlan;
