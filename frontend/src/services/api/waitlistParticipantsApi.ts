import { Attendees } from "@/types/trainingSessionDetails";
import { getBearerToken } from "../apiHelper";
import log from "loglevel";

const baseMappingUrl =
  import.meta.env.VITE_API_BASE_URL + "/api/program-participant";

const waitlistParticipantsApi = {
  getProgramParticipant: async (
    programId: number,
    accountId: number | null | undefined,
  ) => {
    const url = `${baseMappingUrl}/get-participant?programId=${programId}&accountId=${accountId}`;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: getBearerToken(),
      },
    });
    console.log("In waitlistParticipantsApi.getProgramParticipant");
    log.info("------ In waitlistParticipantsApi.getProgramParticipant");
    console.log("response in waitlistParticipantsApi:", response);
    log.info("response in waitlistParticipantsApi:", response);

    if (!response.ok) {
      const errorText = await response.text();
      log.error(`Error: ${response.status}`, errorText);
      throw new Error(`HTTP error ${response.status}: ${errorText}`);
    }

    const data: Attendees = await response.json();
    console.log("Heres the data:", data);
    return data;
  },

  markAbsent: async (
    programId: number,
    accountId: number | null | undefined,
  ) => {
    const url = `${baseMappingUrl}/mark-absent?programId=${programId}&accountId=${accountId}`;
    const response = await fetch(url, {
      method: "PATCH",
      headers: {
        Authorization: getBearerToken(),
      },
    });
    console.log("In waitlistParticipantsApi.markAbsent");
    log.info("------ In waitlistParticipantsApi.markAbsent");
    console.log("response in waitlistParticipantsApi:", response);
    log.info("response in waitlistParticipantsApi:", response);

    if (!response.ok) {
      const errorText = await response.text();
      log.error(`Error: ${response.status}`, errorText);
      throw new Error(`HTTP error ${response.status}: ${errorText}`);
    }

    const data: Attendees = await response.json();
    console.log("Heres the data:", data);
    return data;
  },
};

export default waitlistParticipantsApi;
