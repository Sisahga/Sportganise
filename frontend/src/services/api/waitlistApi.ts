import { getBearerToken } from "@/services/apiHelper";
import { Attendees } from "@/types/trainingSessionDetails";

const baseMappingUrl =
  import.meta.env.VITE_API_BASE_URL + "/api/program-participant";

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
    try {
      const response = await fetch(`${baseMappingUrl}/opt-participant`, {
        method: "PATCH",
        headers: {
          Authorization: getBearerToken(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ programId, accountId }),
      });

      if (!response.ok) {
        throw new Error(`Failed to join the waitlist: ${response.status}`);
      }

      const data = await response.json();
      return data.rank;
    } catch (error) {
      console.error("Error joining the waitlist:", error);
      throw error;
    }
  },

  confirmParticipant: async (
    programId: number,
    accountId: number,
  ): Promise<Attendees | null> => {
    try {
      const response = await fetch(
        `${baseMappingUrl}/confirm-participant?programId=${programId}&accountId=${accountId}`,
        {
          method: "PATCH",
          headers: {
            Authorization: getBearerToken(),
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ programId, accountId }),
        },
      );

      if (!response.ok) {
        throw new Error(`Failed to confirm participant: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error confirming participant:", error);
      return null;
    }
  },
  /** Reject (remove) a participant from the waitlist */
  rejectParticipant: async (
    programId: number,
    accountId: number,
  ): Promise<Attendees | null> => {
    try {
      const response = await fetch(
        `${baseMappingUrl}/out-participant?programId=${programId}&accountId=${accountId}`,
        {
          method: "PATCH",
          headers: {
            Authorization: getBearerToken(),
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ programId, accountId }),
        },
      );

      if (!response.ok) {
        throw new Error(`Failed to reject participant: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error rejecting participant:", error);
      return null;
    }
  },
};

export default waitlistApi;
