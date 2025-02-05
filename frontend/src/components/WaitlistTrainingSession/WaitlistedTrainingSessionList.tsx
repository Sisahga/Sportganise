import WaitlistedTrainingSessionCard from "./WaitlistedTrainingSessionCard";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import log from "loglevel";
import useWaitlistPrograms from "@/hooks/useWaitlistPrograms";
import { Program } from "@/types/trainingSessionDetails";

interface WaitlistedTrainingSessionListProps {
  onSelectTraining: (program: Program) => void;
}

export default function WaitlistedTrainingSessionList({
  onSelectTraining,
}: WaitlistedTrainingSessionListProps) {
  const { waitlistPrograms, error, loading } = useWaitlistPrograms();

  useEffect(() => {
    console.log(
      "WaitlistedTrainingSessionList: Programs fetched:",
      waitlistPrograms,
    );
    log.info(
      "WaitlistedTrainingSessionList: Programs fetched:",
      waitlistPrograms,
    );
  }, [waitlistPrograms]);

  return (
    <div className="mb-32 mt-5">
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
                program={{ programDetails: program, attendees: [] }}
                onSelectTraining={onSelectTraining}
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
}
