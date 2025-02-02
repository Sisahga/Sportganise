import WaitlistedTrainingSessionCard from "./WaitlistedTrainingSessionCard";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import log from "loglevel";
import useWaitlistPrograms from "@/hooks/useWaitlistPrograms";

export default function WaitlistedTrainingSessionsList() {
  const { waitlistPrograms, error, loading } = useWaitlistPrograms();

  // Log the fetched programs
  useEffect(() => {
    log.info(
      "WaitlistedTrainingSessionList : Programs fetched:",
      waitlistPrograms,
    );
  }, [waitlistPrograms]);

  return (
    <div className="mb-32 mt-5">
      {/** List of events */}
      <div>
        <span className="flex mt-8 mx-1">
          <p className="text-lg text-primaryColour text-sec font-semibold">
            Waitlisted Training Sessions
          </p>
        </span>

        {error ? (
          <p className="text-red text-center">
            Error loading waitlist training sessions
          </p>
        ) : loading ? (
          <div className="flex justify-center">
            <Loader2 className="animate-spin" size={30} color="#9ca3af" />
          </div>
        ) : waitlistPrograms.length === 0 ? (
          <p className="text-gray-500 text-center">
            No waitlisted training sessions available
          </p>
        ) : (
          waitlistPrograms.map((program, index) => (
            <div key={index} className="my-5">
              <WaitlistedTrainingSessionCard
                programDetails={program.programDetails}
                attendees={program.attendees}
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
}
