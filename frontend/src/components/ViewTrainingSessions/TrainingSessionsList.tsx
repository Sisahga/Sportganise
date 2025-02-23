/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState, useEffect } from "react";
import { DateRangePicker } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { addDays } from "date-fns";
import TrainingSessionCard from "./TrainingSessionCard";
import usePrograms from "@/hooks/usePrograms";
import { Program } from "@/types/trainingSessionDetails";
import { getAccountIdCookie, getCookies } from "@/services/cookiesService";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Filter, Loader2 } from "lucide-react";
import log from "loglevel";

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

  // Date Range For This Week
  const today = new Date();
  const todayStartDate = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  );

  // Start Date Range
  const [dateRange, setDateRange] = useState([
    {
      startDate: todayStartDate, // today's date
      endDate: addDays(new Date(), 7), // upcoming programs for next 7 days
      key: "selection",
    },
  ]);

  // Filter Programs by Date Range
  const filteredPrograms: Program[] = programs.filter((program) => {
    const programDate = new Date(program.programDetails.occurrenceDate);
    return (
      programDate >= dateRange[0].startDate &&
      programDate <= dateRange[0].endDate
    );
  });

  return (
    <div className="mt-5 lg:mx-24">
      {/**List of events */}
      <div>
        <span className="flex mt-8 mx-1">
          <div>
            <p className="text-lg text-primaryColour text-sec font-semibold">
              Upcoming Programs
            </p>
            <p className="text-xs text-gray-400 mt-1">
              {dateRange[0].startDate.toLocaleDateString()} -{" "}
              {dateRange[0].endDate.toLocaleDateString()}
            </p>
          </div>
          <Sheet>
            <SheetTrigger asChild>
              <button className="ml-auto bg-transparent">
                <Filter color="rgb(130 219 216 / var(--tw-text-opacity, 1))" />
              </button>
            </SheetTrigger>
            <SheetContent side="bottom">
              <SheetHeader>
                <SheetTitle>Filter Programs by date</SheetTitle>
                <SheetDescription>Select a date range.</SheetDescription>
              </SheetHeader>
              <div className="flex overflow-auto my-5">
                <DateRangePicker
                  editableDateInputs={true}
                  onChange={(item: any) => setDateRange([item.selection])}
                  moveRangeOnFirstSelection={false}
                  ranges={dateRange}
                />
              </div>
            </SheetContent>
          </Sheet>
        </span>
        {error ? (
          <p className="text-red text-center my-5">Error loading programs</p>
        ) : loading ? (
          <div className="flex justify-center my-5">
            <Loader2 className="animate-spin" size={30} color="#9ca3af" />
          </div>
        ) : filteredPrograms.length === 0 ? (
          <p className="text-gray-500 text-center my-5">
            There are no programs for the current dates.
          </p>
        ) : (
          filteredPrograms
            .sort(
              (a, b) =>
                new Date(a.programDetails.occurrenceDate).getTime() -
                new Date(b.programDetails.occurrenceDate).getTime()
            )
            .map((program, index) => (
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
