import WaitlistedTrainingSessionCard from "./WaitlistedTrainingSessionCard";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import log from "loglevel";
import useWaitlistPrograms from "@/hooks/useWaitlistPrograms";
import { Program } from "@/types/trainingSessionDetails";

interface WaitlistedTrainingSessionListProps {
  onSelectTraining: (programDetails: Program) => void;
}

export default function WaitlistedTrainingSessionList({
  onSelectTraining,
}: WaitlistedTrainingSessionListProps) {
  const { waitlistPrograms, error, loading } = useWaitlistPrograms();

  useEffect(() => {
    log.info(
      "WaitlistedTrainingSessionList: Programs fetched:",
      waitlistPrograms,
    );
  }, [waitlistPrograms]);

  return (
    <div className="flex flex-col min-h-screen pb-20">
      <div>
        <span className="flex mt-8 mx-1">
          <p className="text-lg text-primaryColour text-sec font-semibold">
            Available Sessions
          </p>
        </span>

        {error ? (
          <p className="text-red text-center">
            Error loading waitlist programs
          </p>
        ) : loading ? (
          <div className="flex justify-center">
            <Loader2 className="animate-spin" size={30} color="#9ca3af" />
          </div>
        ) : waitlistPrograms.length === 0 ? (
          <p className="text-gray-500 text-center">
            No waitlisted programs available
          </p>
        ) : (
          waitlistPrograms.map((program, index) => (
            <div key={index} className="my-5">
              <WaitlistedTrainingSessionCard
                programDetails={program.programDetails}
                onSelectTraining={() =>
                  onSelectTraining({
                    programDetails: program.programDetails,
                    attendees: [],
                  })
                }
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
}
