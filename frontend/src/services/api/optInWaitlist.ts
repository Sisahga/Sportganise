const baseUrl = "/program-participant";

const programParticipantApi = {
  joinQueue: async (programId: number, accountId: number): Promise<number> => {
    const response = await fetch(`${baseUrl}/opt-participant`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ programId, accountId }),
    });

    if (!response.ok) {
      throw new Error("Failed to join the queue");
    }

    const data = await response.json();
    return data.rank; // Return the rank from the API response
  },
};

export default programParticipantApi;
