import log from "loglevel";
import ResponseDto from "@/types/response";
import { UploadTrainingPlansDto } from "@/types/trainingplans";
import {getBearerToken} from "@/services/apiHelper.ts"; //trainingPlans: string[]

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL + "/api/training-plans";

const trainingPlanApi = {
  uploadTrainingPlans: async (
    accountId: number,
    trainingPlans: File[],
  ): Promise<ResponseDto<UploadTrainingPlansDto>> => {
    const response = await fetch(`${API_BASE_URL}/${accountId}/upload`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": getBearerToken(),
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
};

export default trainingPlanApi;
