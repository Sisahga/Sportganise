import { Program } from "@/types/trainingSessionDetails";
import { ProgramDetails } from "@/types/trainingSessionDetails";
import ResponseDto from "@/types/response.ts";
import log from "loglevel";
import { ApiService } from "@/services/apiHelper.ts";

const EXTENDED_BASE_URL = "/api/programs";

const trainingSessionApi = {
  /**Submit CreateTrainingSession form */
  createTrainingSession: async (
    accountId: number | null | undefined,
    jsonPayload: FormData,
  ) => {
    const response = await ApiService.post<ResponseDto<ProgramDetails>>(
      `${EXTENDED_BASE_URL}/${accountId}/create-program`,
      jsonPayload,
      {
        isMultipart: true,
      },
    );
    log.debug("Response in trainingSessionApi:", response);

    if (response.statusCode === 201) {
      return response;
    } else {
      log.error("Error thrown in trainingSessionApi.createTrainingSession.");
      throw new Error(
        "Error thrown in trainingSessionApi.createTrainingSession.",
      );
    }
  },
  /**Submit ModifyTrainingSession form */
  modifyTrainingSession: async (
    accountId: number | null | undefined,
    programId: number,
    formValues: FormData,
  ) => {
    const response = await ApiService.post<ResponseDto<ProgramDetails>>(
      `${EXTENDED_BASE_URL}/${accountId}/${programId}/modify-program`,
      formValues,
      {
        isMultipart: true,
      },
    );
    log.debug(
      "Reponse from trainingSessionApi.modifyTrainignSession : ",
      response,
    );

    if (response.statusCode === 200) {
      return response;
    } else {
      log.error("Error thrown in trainingSessionApi.modifyTrainignSession.");
      throw new Error(
        "Error thrown in trainingSessionApi.modifyTrainignSession.",
      );
    }
  },

  /**Fetch all programs info */
  getPrograms: async (accountId?: number | null) => {
    const response = await ApiService.get<ResponseDto<Program[]>>(
      `${EXTENDED_BASE_URL}/${accountId}/details`,
    );

    if (response.statusCode === 200) {
      log.debug("Programs successfully fetched.");
      return response;
    } else {
      log.error("Error fetching programs:", response.statusCode);
      return response;
    }
  },

  getProgramDates: async (accountId?: number | null) => {
    if (!accountId) {
      console.warn("Skipping fetchProgramDates because accountId is null.");
      return [];
    }

    const response = await ApiService.get<ResponseDto<Program[]>>(
      `${EXTENDED_BASE_URL}/${accountId}/details`,
    );

    if (response.statusCode === 200) {
      if (!Array.isArray(response.data)) {
        log.error("Error: API response is not an array.");
        return [];
      } else {
        log.debug("trainingSessionApi.getPrograms:", response);
        return response.data
          .map((program) => program.programDetails?.occurrenceDate)
          .filter(
            (date) => typeof date === "string" && !isNaN(Date.parse(date)),
          )
          .map((date) => new Date(date));
      }
    } else {
      log.error("Error fetching program dates:", response);
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

    const response = await ApiService.delete<any>(
      `${EXTENDED_BASE_URL}/${accountId}/delete-program/${programId}`,
    );

    if (response.status === 204) {
      log.debug("Program successfully deleted.");
      return response;
    } else {
      log.error("Error deleting program:", response.status);
      throw new Error("Error deleting program.");
    }
  },
};

export default trainingSessionApi;
