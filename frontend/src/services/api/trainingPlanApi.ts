import log from "loglevel";
import ResponseDto from "@/types/response";
import { UploadTrainingPlansDto } from "@/types/trainingplans"; //trainingPlans: string[]

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL + "/api";

const trainingPlanApi = {
  uploadTrainingPlans: async (
    accountId: number,
    trainingPlans: File[]
  ): Promise<ResponseDto<UploadTrainingPlansDto>> => {
    const response = await fetch(
      `${API_BASE_URL}/training-plans/${accountId}/upload`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(trainingPlans),
      }
    );

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
