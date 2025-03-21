import WaitlistedTrainingSessionCard from "./WaitlistedTrainingSessionCard";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import useWaitlistPrograms from "@/hooks/useWaitlistPrograms";
import { Program } from "@/types/trainingSessionDetails";
import { getCookies } from "@/services/cookiesService";
import { CookiesDto } from "@/types/auth";

interface WaitlistedTrainingSessionListProps {
  onSelectTraining: (programDetails: Program) => void;
}

export default function WaitlistedTrainingSessionList({
  onSelectTraining,
}: WaitlistedTrainingSessionListProps) {
  const { data: waitlistData, error, loading, waitlistPrograms } = useWaitlistPrograms();
  const [user, setUser] = useState<CookiesDto>();

  // Run only once on component mount
  useEffect(() => {
    const userCookie = getCookies();
    setUser(userCookie);
  }, []);

  // Call backend when user is set
  useEffect(() => {
    if (user?.accountId) {
      waitlistPrograms(user.accountId);
    }
  }, [user, waitlistPrograms]);

  useEffect(() => {
    if (waitlistData) {
      console.log("Waitlist Programs Data inside waitlistTrainingPage:", waitlistData);
    }
  }, [waitlistData]);

  if (error) {
    return (
      <p className="text-red text-center">
        Error loading waitlist programs
      </p>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center">
        <Loader2 className="animate-spin" size={30} color="#9ca3af" />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen pb-20">
      <div>
        <span className="flex mt-8 mx-1">
          <p className="text-lg text-primaryColour text-sec font-semibold">
            Available Sessions
          </p>
        </span>
        {waitlistData && waitlistData.length > 0 ? (
          waitlistData.map((program, index) => (
            <div key={index} className="my-5">
              <WaitlistedTrainingSessionCard
                programDetails={program}
                onSelectTraining={() =>
                  onSelectTraining({
                    programDetails: program,
                    attendees: [],
                  })
                }
              />
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center">
            No waitlisted programs available
          </p>
        )}
      </div>
    </div>
  );
}
