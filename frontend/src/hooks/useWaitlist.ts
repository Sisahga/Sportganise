import { useState, useEffect } from "react";
import waitlistApi from "@/services/api/waitlistApi";
import { WaitlistParticipant } from "@/types/waitlistParticipant";
import { Program } from "@/types/trainingSessionDetails";

export function useWaitlist(programId: number) {
  const [waitlist, setWaitlist] = useState<WaitlistParticipant[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWaitlist = async () => {
      setLoading(true);
      try {
        const programs: Program[] = await waitlistApi.getWaitlistPrograms();

        const transformedWaitlist: WaitlistParticipant[] = programs
          .filter((program) => program.programDetails.programId === programId)
          .flatMap((program) =>
            program.attendees.map((attendee) => ({
              accountId: attendee.accountId,
              firstName: "N/A",
              lastName: "N/A",
              pictureUrl: "",
              rank: attendee.rank,
              programId: program.programDetails.programId,
              confirmedDate: attendee.confirmedDate || null,
              confirmed: attendee.confirmed || false,
            })),
          );

        setWaitlist(transformedWaitlist);
      } catch (err) {
        setError("Failed to fetch waitlist.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchWaitlist();
  }, [programId]);

  return { waitlist, loading, error };
}
