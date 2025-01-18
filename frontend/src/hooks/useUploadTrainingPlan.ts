import { useState } from "react";
import ResponseDto from "@/types/response";
import { UploadTrainingPlansDto } from "@/types/trainingplans";
import trainingPlanApi from "@/services/api/trainingPlanApi";

function useUploadTrainingPlan() {
  const [uploadingTrainingPlanResponse, setUploadingTrainingPlanResponse] =
    useState<ResponseDto<UploadTrainingPlansDto> | null>(null);
  const uploadTrainingPlans = async (
    accountId: number,
    trainingPlans: File[]
  ) => {
    try {
      const data = await trainingPlanApi.uploadTrainingPlans(
        accountId,
        trainingPlans
      );
      setUploadingTrainingPlanResponse(data);
      return data;
    } catch (err) {
      console.error("Error uploading training plan(s)", err);
      return null;
    }
  };
  return {
    uploadTrainingPlans,
    uploadingTrainingPlanResponse,
  };
}
