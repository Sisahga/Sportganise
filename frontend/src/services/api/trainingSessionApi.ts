import { FormValues } from "@/types/trainingSessionFormValues";
import log from "loglevel";

const baseMappingUrl = import.meta.env.VITE_API_BASE_URL + "/api";

const trainingSessionApi = {
  /**Submit CreateTrainingSession form */
  createTrainingSession: async (accountId: number, jsonPayload: FormValues) => {
    const response = await fetch(
      `${baseMappingUrl}/programs/${accountId}/create-program`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(jsonPayload),
      },
    );
    console.log("In trainingSessionApi.createTrainingSession");
    log.info("------ In trainingSessionApi.createTrainingSession");
    console.log("response:", response);
    log.info("response:", response);

    if (!response.ok) {
      const errorText = await response.text(); //read response as text
      console.error(`Error: ${response.status}`, errorText);
      log.error(`Error: ${response.status}`, errorText);
      throw new Error(`HTTP error ${response.status}: ${errorText}`);
    }
    log.info(response.json());
    log.info("------- END OF 'trainingSessionApi.createTrainingSession'");
    return response.json();
  },
  /**Submit ModifyTrainingSession form */
  /**Fetch all programs info */
};

export default trainingSessionApi;
