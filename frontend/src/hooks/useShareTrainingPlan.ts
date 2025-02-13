import trainingPlanApi from "@/services/api/trainingPlanApi";
import ResponseDto from "@/types/response";
import { ShareTrainingPlanDto } from "@/types/trainingplans";
import log from "loglevel";

/**
 * Shares a selected training plan with all coaches/admin.
 *
 * @param accountId
 * @param planId
 * @returns useShareTrainingPlan()
 */
function useShareTrainingPlan() {
  // Delete A Selected Training Plan
  const shareTrainingPlan = async (
    accountId: number | null | undefined,
    planId: number
  ) => {
    // Call Api Endpoint
    const data: ResponseDto<ShareTrainingPlanDto> =
      await trainingPlanApi.shareTrainingPlan(accountId, planId);

    // Handle HTTP StatusCode
    if (data.statusCode !== 200) {
      log.error(
        `useShareTrainingPlan.shareTrainingPlan -> Errow thrown! ${data.message}`
      );
      throw new Error(data.message); // Throw Dto message to error toast in ConfirmationDialog
    }

    log.info("useShareTrainingPlan.shareTrainingPlan -> data is", data);
    return data; // Return sucess
  };
  return {
    shareTrainingPlan, // Accessable outside top level
  };
}

export default useShareTrainingPlan;
