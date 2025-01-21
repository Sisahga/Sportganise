import { FormValues } from "@/types/trainingSessionFormValues";
import { Program } from "@/types/trainingSessionDetails";
import ResponseDto from "@/types/response.ts";
import log from "loglevel";

const baseMappingUrl = import.meta.env.VITE_API_BASE_URL + "/api/programs";

const trainingSessionApi = {
  /**Submit CreateTrainingSession form */
  createTrainingSession: async (accountId: number, jsonPayload: FormData) => {
    const response = await fetch(
      "http://httpbin.org/post",
      /*`${baseMappingUrl}/${accountId}/create-program`*/ {
        method: "POST",
        body: jsonPayload,
      }
    );
    console.log("RESPONSE!!!!!!!", response);
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

  /**Fetch all programs info */
  getPrograms: async (accountId: number) => {
    const response = await fetch(`${baseMappingUrl}/${accountId}/details`);
    const data: ResponseDto<Program[]> = await response.json();

    if (!response.ok) {
      throw new Error("trainingSessionApi.getPrograms : Response not ok!");
    }

    log.info("trainingSessionApi.getPrograms:", response);
    log.info("trainingSessionApi.getPrograms:", data);

    return data;
  },
};

export default trainingSessionApi;
