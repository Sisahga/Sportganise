import { WaitlistParticipant } from "@/types/waitlistParticipant";
import { Program } from "@/types/trainingSessionDetails.ts";

const baseMappingUrl =
  import.meta.env.VITE_API_BASE_URL + "/api/program-participant";

const waitlistApi = {
  getWaitlist: async (programId: number): Promise<WaitlistParticipant[]> => {
    try {
      const response = await fetch(
        `${baseMappingUrl}/queue?programId=${programId}`,
      );
      if (!response.ok) {
        throw new Error("Failed to fetch waitlist");
      }
      const data = await response.json();
      return data; // Return waitlist participants
    } catch (error) {
      console.error("Error fetching waitlist:", error);
      return [];
    }
  },
  getWaitlistPrograms: async (): Promise<Program[]> => {
    try {
      const response = await fetch(`${baseMappingUrl}/waitlist-programs`);
      if (!response.ok) {
        throw new Error("Failed to fetch waitlist programs");
      }
      const data = await response.json();
      return data; // Return a list of waitlist programs
    } catch (error) {
      console.error("Error fetching waitlist programs:", error);
      return [];
    }
  },
};

export default waitlistApi;
