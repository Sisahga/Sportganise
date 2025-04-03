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
  getPrograms: async (accountId?: number | null) => {
    if (!accountId) {
      console.warn("Skipping fetchPrograms because accountId is null."); // Prevents API call
      return { data: [] }; //  Return an empty array instead of calling API
    }

    const url = `${baseMappingUrl}/${accountId}/details`; // Only call API if accountId is present

    try {
      const response = await fetch(url, {
        headers: { Authorization: getBearerToken() },
      });

      if (!response.ok) {
        console.error("Error fetching programs:", response.status);
        throw new Error(
          `trainingSessionApi.getPrograms : Response not ok! (${response.status})`,
        );
      }

      return response.json();
    } catch (error) {
      console.error("Error in getPrograms:", error);
      return { data: [] }; // Prevent breaking UI if API fails
    }
  },

  getProgramDates: async (accountId?: number | null) => {
    if (!accountId) {
      console.warn("Skipping fetchProgramDates because accountId is null.");
      return [];
    }

    const url = `${baseMappingUrl}/${accountId}/details`; // Calls API only if accountId exists

    try {
      const response = await fetch(url, {
        headers: {
          Authorization: getBearerToken(),
        },
      });

      if (!response.ok) {
        console.error("Error fetching program dates:", response.status);
        throw new Error(
          `trainingSessionApi.getProgramDates : Response not ok! (${response.status})`,
        );
      }

      const data: ResponseDto<Program[]> = await response.json();
      if (!Array.isArray(data.data)) {
        console.error("Error: API response is not an array.");
        return [];
      }

      log.info("trainingSessionApi.getPrograms:", response);
      log.info("trainingSessionApi.getPrograms: ", data);

      return data.data
        .map((program) => program.programDetails?.occurrenceDate)
        .filter((date) => typeof date === "string" && !isNaN(Date.parse(date)))
        .map((date) => new Date(date));
    } catch (error) {
      console.error("Error in getProgramDates:", error);
      return [];
    }
  },

  /**Delete Program */
  deleteProgram: async (
    accountId: number | null | undefined,
    programId: number,
  ) => {
    if (!accountId || !programId) {
      log.warn(
        "Skipping deleteProgram because accountId or programId is null.",
      );
      return;
    }

    const url = `${baseMappingUrl}/${accountId}/delete-program/${programId}`;
    try {
      log.info("Delete confirmation initiated");
      log.info("Making DELETE request to:", url);

      const response = await fetch(url, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: getBearerToken(),
        },
      });

      if (!response.ok) {
        log.error("Failed to delete program. Response:", response);
        throw new Error("Failed to delete training session");
      }

      log.info("Program successfully deleted");
      return response.json();
    } catch (error) {
      log.error("Error deleting the program:", error);
    }
  },
};

export default trainingSessionApi;
