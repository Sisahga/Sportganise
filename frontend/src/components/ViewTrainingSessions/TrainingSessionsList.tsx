/**
 * For now, this is the content shown on the Calendar Page. Might be changed later
 */

import TrainingSessionCard from "./TrainingSessionCard";
import { Filter, Loader2 } from "lucide-react";
import { useEffect } from "react";
import log from "loglevel";
import usePrograms from "@/hooks/usePrograms";
import { getAccountIdCookie, getCookies } from "@/services/cookiesService";

export default function TrainingSessionsList() {
  log.debug("Rendering TrainingSessionList");

  // AccountId from cookies
  const cookies = getCookies();
  const accountId = cookies ? getAccountIdCookie(cookies) : null;
  useEffect(() => {
    if (!accountId) {
      log.debug("No accountId found");
    }
    log.info(`TrainingSessionList accountId is ${accountId}`);
  }, [accountId]);

  // Fetch programs on component mount
  const { programs, /*setPrograms,*/ error, loading } = usePrograms(accountId); // Program[]
  useEffect(() => {
    console.log("TrainingSessionList : Programs fetched:", programs);
    log.info("TrainingSessionList : Programs fetched:", programs);
  }, [programs]); // update page if changes in programs occur

  return (
    <div className="mb-32 mt-5 lg:mx-24">
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
              <TrainingSessionCard
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
