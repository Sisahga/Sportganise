import { WaitlistParticipant } from "@/types/waitlistParticipant";

const waitlistApi = {
  getWaitlist: async (programId: number): Promise<WaitlistParticipant[]> => {
    try {
      const response = await fetch(
        `/program-participant/queue?programId=${programId}`,
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
};

export default waitlistApi;
