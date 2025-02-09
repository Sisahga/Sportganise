import log from "loglevel";
import ResponseDto from "@/types/response";
import {
  UploadTrainingPlansDto,
  TrainingPlansDto,
} from "@/types/trainingplans";
import { getBearerToken } from "@/services/apiHelper.ts";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL + "/api/training-plans";

/**
 * Training Plan APIs
 * - uploadTrainingPlans(accountId, trainingPlans) -> submits 'TraningPlans' form
 * - fetchTrainingPlans(accountId) -> populates 'TrainingPlans' table
 */
const trainingPlanApi = {
  // Upload Training Plan(s)
  uploadTrainingPlans: async (
    accountId: number,
    trainingPlans: File[]
  ): Promise<ResponseDto<UploadTrainingPlansDto>> => {
    const response = await fetch(`${API_BASE_URL}/${accountId}/upload`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: getBearerToken(),
      },
      body: JSON.stringify(trainingPlans),
    });

    if (!response.ok) {
      throw new Error("Error thrown in trainingPlanApi.uploadTrainingPlans.");
    }

    const data = await response.json();
    console.log("Upload training plan(s) response:", data);
    log.info("Upload training plan(s) response:", data);
    return data;
  },

  // Fetch Training Plan(s)
  fetchTrainingPlans: async (
    accountId: number | null | undefined
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
    log.info(`trainingPlanApi.fetchTrainingPlans -> response is ${data}`);
    return data;
  },
};

export default trainingPlanApi;
