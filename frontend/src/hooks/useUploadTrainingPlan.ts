import { useState } from "react";
import ResponseDto from "@/types/response";
import { UploadTrainingPlansDto } from "@/types/trainingplans"; // trainingPlans?: string[];
import trainingPlanApi from "@/services/api/trainingPlanApi";
import log from "loglevel";

function useUploadTrainingPlan() {
  // States
  const [uploadingTrainingPlanResponse, setUploadingTrainingPlanResponse] =
    useState<ResponseDto<UploadTrainingPlansDto> | null>();

  // Upload Training Plans
  const uploadTrainingPlans = async (
    accountId: number | null | undefined,
    trainingPlans: FormData,
  ) => {
    try {
      // API Call
      const response = await trainingPlanApi.uploadTrainingPlans(
        accountId,
        trainingPlans,
      );

      // Set State
      setUploadingTrainingPlanResponse(response);
      log.info(
        "useUploadTrainingPlan.uploadTrainingPlans -> response",
        response,
      );

      return response;
    } catch (err) {
      // Handle Error
      log.error(
        "useUploadTrainingPlan.uploadTrainingPlans -> Error thrown!",
        err,
      );

      return null;
    }
  };
  // Return function and Dto
  return {
    uploadTrainingPlans,
    uploadingTrainingPlanResponse,
  };
}

export default useUploadTrainingPlan;
