import log from "loglevel";
import ResponseDto from "@/types/response";
import {
  UploadTrainingPlansDto,
  TrainingPlansDto,
  DeleteTrainingPlanDto,
  ShareTrainingPlanDto,
} from "@/types/trainingplans";
import { ApiService } from "@/services/apiHelper.ts";

const EXTENDED_BASE_URL = "/api/training-plans";

/**
 * Training Plan APIs
 * - uploadTrainingPlans(accountId, trainingPlans) -> submits 'TraningPlans' form
 * - fetchTrainingPlans(accountId) -> populates 'TrainingPlans' table
 * - deleteTrainingPlan(accoundId, planId) -> deletes planId associated with user with accountId
 * - shareTrainingPlan(accountId, planId) -> shares a selected training plan with ALL coaches/admin
 */
const trainingPlanApi = {
  // Upload Training Plan(s)
  uploadTrainingPlans: async (
    accountId: number | null | undefined,
    trainingPlans: FormData,
  ): Promise<ResponseDto<UploadTrainingPlansDto>> => {
    const response = await ApiService.post<ResponseDto<UploadTrainingPlansDto>>(
      `${EXTENDED_BASE_URL}/${accountId}/upload`,
      trainingPlans,
      {
        isMultipart: true,
      },
    );

    if (response.statusCode === 201) {
      log.debug("uploadTrainingPlans response: ", response);
      return response;
    } else {
      log.error("Error thrown in trainingPlanApi.uploadTrainingPlans.");
      throw new Error("Error thrown in trainingPlanApi.uploadTrainingPlans.");
    }
  },

  // Fetch Training Plan(s)
  fetchTrainingPlans: async (
    accountId: number | null | undefined,
  ): Promise<ResponseDto<TrainingPlansDto>> => {
    const response = await ApiService.get<ResponseDto<TrainingPlansDto>>(
      `${EXTENDED_BASE_URL}/${accountId}/view-plans`,
    );

    if (response.statusCode === 200) {
      log.debug("trainingPlanApi.fetchTrainingPlans -> response is", response);
      return response;
    } else {
      log.error("Error thrown in trainingPlanApi.fetchTrainingPlans.");
      throw new Error("Error thrown in trainingPlanApi.fetchTrainingPlans.");
    }
  },

  // Delete a Selected Training Plan
  deleteTrainingPlan: async (
    userId: number | null | undefined,
    planId: number,
  ): Promise<ResponseDto<DeleteTrainingPlanDto>> => {
    const response = await ApiService.delete<
      ResponseDto<DeleteTrainingPlanDto>
    >(`${EXTENDED_BASE_URL}/${userId}/${planId}/delete-plan`);

    if (response.statusCode === 200) {
      log.debug("trainingPlanApi.deleteTrainingPlan response: ", response);
      return response;
    } else {
      log.error("Error thrown in trainingPlanApi.deleteTrainingPlan.");
      throw new Error("Error thrown in trainingPlanApi.deleteTrainingPlan.");
    }
  },

  // Share a Selected Training Plan
  shareTrainingPlan: async (
    accountId: number | null | undefined,
    planId: number,
  ): Promise<ResponseDto<ShareTrainingPlanDto>> => {
    const response = await ApiService.post<ResponseDto<ShareTrainingPlanDto>>(
      `${EXTENDED_BASE_URL}/${accountId}/${planId}/share-plan`,
      {},
    );

    if (response.statusCode === 200) {
      log.debug("trainingPlanApi.shareTrainingPlan response: ", response);
      return response;
    } else {
      log.error("Error thrown in trainingPlanApi.shareTrainingPlan.");
      throw new Error("Error thrown in trainingPlanApi.shareTrainingPlan.");
    }
  },
};

export default trainingPlanApi;
