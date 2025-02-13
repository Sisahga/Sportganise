import log from "loglevel";
import ResponseDto from "@/types/response";
import {
  UploadTrainingPlansDto, // trainingPlan: string[];
  TrainingPlansDto,
  DeleteTrainingPlanDto,
} from "@/types/trainingplans";
import { getBearerToken } from "@/services/apiHelper.ts";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL + "/api/training-plans";

/**
 * Training Plan APIs
 * - uploadTrainingPlans(accountId, trainingPlans) -> submits 'TraningPlans' form
 * - fetchTrainingPlans(accountId) -> populates 'TrainingPlans' table
 * - deleteTrainingPlan(accoundId, planId) -> deletes planId associated with user with accountId
 */
const trainingPlanApi = {
  // Upload Training Plan(s)
  uploadTrainingPlans: async (
    accountId: number | null | undefined,
    trainingPlans: FormData,
  ): Promise<ResponseDto<UploadTrainingPlansDto>> => {
    const response = await fetch(`${API_BASE_URL}/${accountId}/upload`, {
      method: "POST",
      headers: {
        Authorization: getBearerToken(),
      },
      body: trainingPlans,
    });

    if (!response.ok) {
      log.error("trainingPlanApi.uploadTrainingPlans -> Error thrown!");
      throw new Error("trainingPlanApi.uploadTrainingPlans -> Error thrown!");
    }

    const data: ResponseDto<UploadTrainingPlansDto> = await response.json();
    log.info(
      "trainingPlanApi.uploadTrainingPlans -> Upload training plan(s) response:",
      data,
    );
    return data;
  },

  // Fetch Training Plan(s)
  fetchTrainingPlans: async (
    accountId: number | null | undefined,
  ): Promise<ResponseDto<TrainingPlansDto>> => {
    const response = await fetch(`${API_BASE_URL}/${accountId}/view-plans`, {
      headers: {
        Authorization: getBearerToken(),
      },
    });

    if (!response.ok) {
      log.error("Error thrown in trainingPlanApi.fetchTrainingPlans.");
      throw new Error("Error thrown in trainingPlanApi.fetchTrainingPlans.");
    }

    const data: ResponseDto<TrainingPlansDto> = await response.json();
    log.info("trainingPlanApi.fetchTrainingPlans -> response is", data);
    return data;
  },

  // Delete Training Plan
  deleteTrainingPlan: async (
    userId: number | null | undefined,
    planId: number,
  ): Promise<ResponseDto<DeleteTrainingPlanDto>> => {
    const response = await fetch(
      `${API_BASE_URL}/${userId}/${planId}/delete-plan`,
      {
        method: "DELETE",
        headers: {
          Authorization: getBearerToken(),
        },
      },
    );

    if (!response.ok) {
      log.error("trainingPlanApi.deleteTrainingPlan -> Error thrown!");
      const data: ResponseDto<DeleteTrainingPlanDto> = await response.json();
      throw new Error(data.message); // Throw specific HTTP dto message, to be caught at ConfirmationDialog
    }

    const data: ResponseDto<DeleteTrainingPlanDto> = await response.json();
    log.info("trainingPlanApi.deleteTrainingPlan -> response is", data);
    return data;
  },
};

export default trainingPlanApi;
