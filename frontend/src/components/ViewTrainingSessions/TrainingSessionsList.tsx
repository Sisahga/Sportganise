/**
 * For now, this is the content shown on the Calendar Page. Might be changed later
 */

import TrainingSessionCard from "./TrainingSessionCard";
import { Calendar } from "@/components/ui/calendar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Filter, Loader2 } from "lucide-react";
import { useEffect } from "react";
import log from "loglevel";
import usePrograms from "@/hooks/usePrograms";

export default function TrainingSessionsList() {
  const accountId = 2; // TODO : replace with cookie
  const { programs, /*setPrograms,*/ error, loading } = usePrograms(accountId); // Program[]

  // Fetch programs on component mount
  useEffect(() => {
    console.log("TrainingSessionList : Programs fetched:", programs);
    log.info("TrainingSessionList : Programs fetched:", programs);
  }, [programs]); // update page if changes in programs occur

  return (
    <div className="mb-32 mt-5">
      {/**Title */}
      <h2 className="font-semibold text-3xl text-secondaryColour text-center">
        Schedule
      </h2>

      {/**Tabs content */}
      <div className="my-5 grid-row-3 justify-items-center">
        <Tabs defaultValue="month" className="w-[400px]">
          <div className="flex justify-center">
            <TabsList>
              <TabsTrigger value="month">Month</TabsTrigger>
              <TabsTrigger value="week">Week</TabsTrigger>
              <TabsTrigger value="day">Day</TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="day">Day view here...</TabsContent>
          <TabsContent value="week">Week view here...</TabsContent>
          <TabsContent value="month">
            <div className="w-[250px] justify-self-center my-5">
              <Calendar />
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <hr className="h-px bg-gray-200 border-0 dark:bg-gray-700" />

      {/**List of events */}
      <div>
        <span className="flex mt-8 mx-1">
          <p className="text-lg text-primaryColour text-sec font-semibold">
            Upcoming Training Sessions
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
