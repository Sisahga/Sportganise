/**
 * For now, this is the content shown on the Calendar Page. Might be changed later
 */

import WaitlistedTrainingSessionCard from "./WaitlistedTrainingSessionCard";
import { Filter, Loader2 } from "lucide-react";
import { useEffect } from "react";
import log from "loglevel";
import usePrograms from "@/hooks/usePrograms";

export default function WaitlistedTrainingSessionsList() {
  const accountId = 2; // TODO : replace with cookie
  const { programs, /*setPrograms,*/ error, loading } = usePrograms(accountId); // Program[]
  //todo: make this only waitlisted programs

  // Fetch programs on component mount
  useEffect(() => {
    console.log("WaitlistedTrainingSessionList : Programs fetched:", programs);
    log.info("WaitlistedTrainingSessionList : Programs fetched:", programs);
  }, [programs]); // update page if changes in programs occur

  return (
    <div className="mb-32 mt-5">
      {/**List of events */}
      <div>
        <span className="flex mt-8 mx-1">
          <p className="text-lg text-primaryColour text-sec font-semibold">
            Upcoming Programs
          </p>
          <button className="ml-auto bg-transparent">
            <Filter color="rgb(130 219 216 / var(--tw-text-opacity, 1))" />
          </button>
        </span>
        {error ? (
          <p className="text-red text-center">Error loading programs</p>
        ) : loading ? (
          <div className="flex justify-center">
            <Loader2 className="animate-spin" size={30} color="#9ca3af" />
          </div>
        ) : programs.length === 0 ? (
          <p className="text-gray-500 text-center">No programs available</p>
        ) : (
          programs.map((program, index) => (
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
