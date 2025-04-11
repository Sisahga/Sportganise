import { ApiService, getBearerToken } from "@/services/apiHelper";
import { Attendees } from "@/types/trainingSessionDetails";
import ResponseDto from "@/types/response.ts";
import log from "loglevel";

const baseMappingUrl =
  import.meta.env.VITE_API_BASE_URL + "/api/program-participant";
const EXTENDED_BASE_URL = "/api/program-participant";

const waitlistApi = {
  /** Fetch all waitlist programs */
  getWaitlistPrograms: async () => {
    try {
      const response = await fetch(`${baseMappingUrl}/waitlist-programs`, {
        method: "GET",
        headers: {
          Authorization: getBearerToken(),
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(
          `Failed to fetch waitlist programs: ${response.status}`,
        );
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching waitlist programs:", error);
      return [];
    }
  },

  /** Opt-in (Join) Waitlist */
  joinQueue: async (programId: number, accountId: number): Promise<number> => {
    const response = await ApiService.patch<ResponseDto<number>>(
      `${EXTENDED_BASE_URL}/opt-participant`,
      {
        programId,
        accountId,
      },
    );

    if (response.statusCode === 200 && response.data) {
      console.log("joinQueue response: ", response);
      return response.data;
    } else if (response.statusCode === 200 && !response.data) {
      log.warn("No data returned from joinQueue API.");
      return 0;
    } else {
      log.error("Error thrown in waitlistApi.joinQueue.");
      throw new Error("Error thrown in waitlistApi.joinQueue.");
    }
  },

  confirmParticipant: async (
    programId: number,
    accountId: number,
  ): Promise<Attendees | null> => {
    const response = await ApiService.patch<ResponseDto<Attendees>>(
      `${EXTENDED_BASE_URL}/confirm-participant?programId=${programId}&accountId=${accountId}`,
      {
        programId,
        accountId,
      },
    );

    if (response.statusCode === 200 && response.data) {
      console.log("confirmParticipant response: ", response);
      return response.data;
    } else if (response.statusCode === 200 && !response.data) {
      log.warn("No data returned from confirmParticipant API.");
      return null;
    } else {
      log.error("Error thrown in waitlistApi.confirmParticipant.");
      throw new Error("Error thrown in waitlistApi.confirmParticipant.");
    }
  },
  /** Reject (remove) a participant from the waitlist */
  rejectParticipant: async (
    programId: number,
    accountId: number,
  ): Promise<Attendees | null> => {
    const response = await ApiService.patch<ResponseDto<Attendees>>(
      `${EXTENDED_BASE_URL}/out-participant?programId=${programId}&accountId=${accountId}`,
      {
        programId,
        accountId,
      },
    );

    if (response.statusCode === 200 && response.data) {
      console.log("rejectParticipant response: ", response);
      return response.data;
    } else if (response.statusCode === 200 && !response.data) {
      log.warn("No data returned from rejectParticipant API.");
      return null;
    } else {
      log.error("Error thrown in waitlistApi.rejectParticipant.");
      throw new Error("Error thrown in waitlistApi.rejectParticipant.");
    }
  },
};

export default waitlistApi;
