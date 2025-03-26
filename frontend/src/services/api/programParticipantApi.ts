import { Attendees, ProgramDetails } from "@/types/trainingSessionDetails";
import { getBearerToken } from "../apiHelper";
import log from "loglevel";

const baseMappingUrl =
  import.meta.env.VITE_API_BASE_URL + "/api/program-participant";

const programParticipantApi = {
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
    console.log("In ProgramParticipantApi.getProgramParticipant");
    log.info("------ In ProgramParticipantApi.getProgramParticipant");
    console.log("response in ProgramParticipantApi:", response);
    log.info("response in ProgramParticipantApi:", response);

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
    console.log("In ProgramParticipantApi.markAbsent");
    log.info("------ In ProgramParticipantApi.markAbsent");
    console.log("response in ProgramParticipantApi:", response);
    log.info("response in ProgramParticipantApi:", response);

    if (!response.ok) {
      const errorText = await response.text();
      log.error(`Error: ${response.status}`, errorText);
      throw new Error(`HTTP error ${response.status}: ${errorText}`);
    }

    const data: Attendees = await response.json();
    console.log("Heres the data:", data);
    return data;
  },

  inviteToPrivateEvent: async (
    accountId: number,
    programId: number | null | undefined,
  ) => {
    const url = `${baseMappingUrl}/invite-private?programId=${programId}&accountId=${accountId}`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: getBearerToken(),
      },
    });
    console.log("In ProgramParticipantApi.inviteToPrivateEvent");
    log.info("------ In ProgramParticipantApi.inviteToPrivateEvent");
    console.log("response in inviteToPrivateEvent:", response);
    log.info("response in inviteToPrivateEvent:", response);

    if (!response.ok) {
      const errorText = await response.text();
      log.error(`Error: ${response.status}`, errorText);
      throw new Error(`HTTP error ${response.status}: ${errorText}`);
    }

    const data: Attendees = await response.json();
    console.log("Heres the data:", data);
    return data;
  },

  optIn: async (programId: number, accountId: number | undefined) => {
    const url = `${baseMappingUrl}/opt-participant?programId=${programId}&accountId=${accountId}`;
    const response = await fetch(url, {
      method: "PATCH",
      headers: {
        Authorization: getBearerToken(),
      },
    });
    console.log("In waitlistParticipantsApi.optIn");
    log.info("------ In waitlistParticipantsApi.optIn");
    console.log("response in waitlistParticipantsApi.optIn:", response);
    log.info("response in waitlistParticipantsApi.optIn:", response);

    if (!response.ok) {
      const errorText = await response.text();
      log.error(`Error: ${response.status}`, errorText);
      throw new Error(`HTTP error ${response.status}: ${errorText}`);
    }

    const data: number = await response.json();
    console.log("Heres the data:", data);
    return data;
  },

  waitlistPrograms: async (accountId: number) => {
    const url = `${baseMappingUrl}/waitlist-programs?accountId=${accountId}`;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: getBearerToken(),
      },
    });
    console.log("In waitlistParticipantsApi.optIn");
    log.info("------ In waitlistParticipantsApi.optIn");
    console.log("response in waitlistParticipantsApi.optIn:", response);
    log.info("response in waitlistParticipantsApi.optIn:", response);

    if (!response.ok) {
      const errorText = await response.text();
      log.error(`Error: ${response.status}`, errorText);
      throw new Error(`HTTP error ${response.status}: ${errorText}`);
    }

    const data: ProgramDetails[] = await response.json();
    console.log("Heres the data:", data);
    return data;
  },
};

export default programParticipantApi;
