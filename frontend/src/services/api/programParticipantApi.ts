import {
  Attendees,
  DetailedProgramParticipantDto,
  ProgramDetails,
} from "@/types/trainingSessionDetails";
import { ApiService } from "../apiHelper";
import { RSVPRequestDto } from "@/types/participation";
import log from "loglevel";
import ResponseDto from "@/types/response.ts";

const EXTENDED_BASE_URL = "/api/program-participant";

const programParticipantApi = {
  getProgramParticipant: async (
    reccurenceId: number,
    accountId: number | null | undefined,
  ) => {
    const url = `${EXTENDED_BASE_URL}/get-participant?reccurenceId=${reccurenceId}&accountId=${accountId}`;

    const response = await ApiService.get<ResponseDto<Attendees>>(url);

    log.info("Fetch Program Participant response: ", response);

    if (response.statusCode === 200 && response.data) {
      return response.data;
    } else if (response.statusCode === 200 && !response.data) {
      log.error("No data found for program participant");
      throw new Error("No data found for program participant");
    } else {
      log.error("Error fetching program participant: ", response);
      throw new Error(
        `Error fetching program participant: ${response.statusCode} - ${response.message}`,
      );
    }
  },

  getCoachAndWaitlistedParticipants: async (programId: number) => {
    return await ApiService.get<ResponseDto<DetailedProgramParticipantDto[]>>(
      `${EXTENDED_BASE_URL}/get-participants-detailed/${programId}`,
    );
  },

  rsvpToProgram: async ({
    programId,
    accountId,
  }: RSVPRequestDto): Promise<boolean> => {
    console.log("Calling RSVP with:", { programId, accountId });

    const url = `${EXTENDED_BASE_URL}/rsvp?programId=${programId}&accountId=${accountId}`;

    const response = await ApiService.post<ResponseDto<boolean>>(url, {});

    if (response.statusCode === 200 && response.data) {
      return response.data;
    } else {
      throw new Error(
        `RSVP failed: ${response.statusCode} ${response.message}`,
      );
    }
  },

  markAbsent: async (
    reccurenceId: number,
    accountId: number | null | undefined,
  ) => {
    const url = `${EXTENDED_BASE_URL}/mark-absent?reccurenceId=${reccurenceId}&accountId=${accountId}`;

    const response = await ApiService.patch<ResponseDto<Attendees>>(url, {});
    log.info("Response mark absent :", response);

    if (response.statusCode === 200 && response.data) {
      return response.data;
    } else if (response.statusCode === 200 && !response.data) {
      log.error("No data found for program participant");
      throw new Error("No data found for program participant");
    } else {
      log.error("Error fetching program participant: ", response);
      throw new Error(
        `Error fetching program participant: ${response.statusCode} - ${response.message}`,
      );
    }
  },

  markUnabsent: async (
    recurrenceId: number,
    accountId: number | null | undefined,
  ) => {
    return await ApiService.patch<ResponseDto<void>>(
      `${EXTENDED_BASE_URL}/mark-unabsent?reccurenceId=${recurrenceId}&accountId=${accountId}`,
      {},
    );
  },

  inviteToPrivateEvent: async (
    accountId: number,
    programId: number | null | undefined,
  ) => {
    const url = `${EXTENDED_BASE_URL}/invite-private?programId=${programId}&accountId=${accountId}`;

    const response = await ApiService.post<ResponseDto<void>>(url, {});

    log.info("Response in inviteToPrivateEvent:", response);

    if (response.statusCode === 201) {
      return response.data;
    } else {
      log.error("Error fetching program participant: ", response);
      throw new Error(
        `Error fetching program participant: ${response.statusCode} - ${response.message}`,
      );
    }
  },

  optIn: async (reccurenceId: number, accountId: number | undefined) => {
    const url = `${EXTENDED_BASE_URL}/opt-participant?reccurenceId=${reccurenceId}&accountId=${accountId}`;

    const response = await ApiService.patch<ResponseDto<number>>(url, {});
    log.info("response in waitlistParticipantsApi.optIn:", response);

    if (response.statusCode === 200 && response.data) {
      return response.data;
    } else if (response.statusCode === 200 && !response.data) {
      log.error("No data found for program participant");
      throw new Error("No data found for program participant");
    } else {
      log.error("Error fetching program participant: ", response);
      throw new Error(
        `Error fetching program participant: ${response.statusCode} - ${response.message}`,
      );
    }
  },

  waitlistPrograms: async (accountId: number) => {
    const url = `${EXTENDED_BASE_URL}/waitlist-programs?accountId=${accountId}`;

    const response = await ApiService.get<ResponseDto<ProgramDetails[]>>(url);
    log.info("Response in waitlistParticipantsApi.optIn :", response);

    if (response.statusCode === 200 && response.data) {
      return response.data;
    } else if (response.statusCode === 200 && !response.data) {
      log.error("No data found for program participant");
      throw new Error("No data found for program participant");
    } else {
      log.error("Error fetching program participant: ", response);
      throw new Error(
        `Error fetching program participant: ${response.statusCode} - ${response.message}`,
      );
    }
  },
};

export default programParticipantApi;
