//import { FormValues } from "@/types/trainingSessionFormValues";
import { Program } from "@/types/trainingSessionDetails";
import { ProgramDetails } from "@/types/trainingSessionDetails";
import ResponseDto from "@/types/response.ts";
import log from "loglevel";
import { getBearerToken } from "@/services/apiHelper.ts";

const baseMappingUrl = import.meta.env.VITE_API_BASE_URL + "/api/programs";

const trainingSessionApi = {
  /**Submit CreateTrainingSession form */
  createTrainingSession: async (
    accountId: number | null | undefined,
    jsonPayload: FormData,
  ) => {
    const response = await fetch(
      `${baseMappingUrl}/${accountId}/create-program`,
      {
        method: "POST",
        headers: {
          Authorization: getBearerToken(),
        },
        body: jsonPayload,
      },
    );
    console.log("In trainingSessionApi.createTrainingSession");
    log.info("------ In trainingSessionApi.createTrainingSession");
    console.log("response in trainingSessionApi:", response);
    log.info("response in trainingSessionApi:", response);

    if (!response.ok) {
      const errorText = await response.text(); //read response as text
      console.error(`Error: ${response.status}`, errorText);
      log.error(`Error: ${response.status}`, errorText);
      throw new Error(`HTTP error ${response.status}: ${errorText}`);
    }
    log.info(response);
    log.info("------- END OF 'trainingSessionApi.createTrainingSession'");
    return response.json();
  },
  /**Submit ModifyTrainingSession form */
  modifyTrainingSession: async (
    accountId: number | null | undefined,
    programId: number,
    formValues: FormData,
  ) => {
    const response = await fetch(
      `${baseMappingUrl}/${accountId}/${programId}/modify-program`,
      {
        method: "POST",
        headers: {
          Authorization: getBearerToken(),
        },
        body: formValues,
      },
    );
    log.info(
      "Reponse from trainingSessionApi.modifyTrainignSession : ",
      response,
    );

    if (!response.ok) {
      throw new Error(
        "trainingSessionApi.modifyTrainignSession : Reponse is not ok!",
      );
    }
    const data: ResponseDto<ProgramDetails> = await response.json();
    return data;
  },

  /**Fetch all programs info */
  getPrograms: async (accountId: number | null | undefined) => {
    const response = await fetch(`${baseMappingUrl}/${accountId}/details`, {
      headers: {
        Authorization: getBearerToken(),
      },
    });
    const data: ResponseDto<Program[]> = await response.json();

    if (!response.ok) {
      throw new Error("trainingSessionApi.getPrograms : Response not ok!");
    }

    log.info("trainingSessionApi.getPrograms:", response);
    log.info("trainingSessionApi.getPrograms: ", data);
    console.log("trainingSessionApi.getPrograms", response);

    return data;
  },
};

export default trainingSessionApi;
