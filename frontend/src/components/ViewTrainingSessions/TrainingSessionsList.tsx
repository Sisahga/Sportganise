/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState, useEffect } from "react";
import { DateRangePicker } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
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
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/Button";
import { Checkbox } from "@/components/ui/checkbox";
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
  const today = new Date(); // get today's date
  const todayDayIndex = today.getDay(); // index of today's day of the week
  const startOfWeek = new Date(today); // same day as today
  log.debug(
    `Today's date is ${today.getDate()} and today's index day number is ${todayDayIndex}. So, the start date of the week is ${today.getDate() - todayDayIndex}`
  );
  startOfWeek.setDate(today.getDate() - todayDayIndex); // start of the week date = today's date - day of week
  const endOfWeek = new Date(today); // same day as today
  log.debug(
    `Today's date is ${today.getDate()} and today's index number is ${todayDayIndex}. So, the end date of the week is ${today.getDate() + (6 - todayDayIndex)}`
  );
  endOfWeek.setDate(today.getDate() + (6 - todayDayIndex)); // end of week date = today's date + nb of days left in week

  // Start Date Range
  const [dateRange, setDateRange] = useState([
    {
      startDate: startOfWeek, // this week
      endDate: endOfWeek,
      key: "selection",
    },
  ]);

  // Handle Selected Program Type
  const [selectedProgramType, setSelectedProgramType] = useState<string[]>([]);
  // List of programDetails.programTypes For Check
  const programTypes = Array.from(
    new Set(programs.map((program) => program.programDetails.programType))
  );

  // Filter Programs by Date Range
  const filteredPrograms: Program[] = programs.filter((program) => {
    const programDate = new Date(
      program.programDetails.reccurenceDate
        ? program.programDetails.reccurenceDate
        : program.programDetails.occurrenceDate
    );
    programDate.setHours(0, 0, 0, 0); // to compare the dateRange and occurenceDate regardless of time
    const dateFilter =
      programDate >= dateRange[0].startDate &&
      programDate <= dateRange[0].endDate;
    const typeFilter =
      selectedProgramType.length === 0 ||
      selectedProgramType.includes(program.programDetails.programType);
    return dateFilter && typeFilter;
  });

  // Handle Cancel
  function handleCancel() {
    setDateRange([
      {
        startDate: startOfWeek,
        endDate: endOfWeek,
        key: "selection",
      },
    ]); // reset date range
    setSelectedProgramType([]); // reset selected program type state
  }

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
                <SheetTitle>Filter Programs</SheetTitle>
                <SheetDescription>Select to filter programs.</SheetDescription>
              </SheetHeader>
              <p className="font-semibold my-3">Filter by date</p>
              <div className="flex overflow-auto my-5">
                <DateRangePicker
                  editableDateInputs={true}
                  onChange={(item: any) => setDateRange([item.selection])}
                  moveRangeOnFirstSelection={false}
                  ranges={dateRange}
                />
              </div>
              <div className="flex flex-col gap-1 my-4">
                <p className="font-semibold mb-3">Filter by type</p>
                {programTypes.map((type, index) => (
                  <label
                    key={index}
                    className="font-medium flex gap-2 items-center"
                  >
                    <Checkbox
                      checked={selectedProgramType.includes(type)}
                      onCheckedChange={(checked) => {
                        setSelectedProgramType((prev) =>
                          checked
                            ? [...prev, type]
                            : prev.filter((t) => t !== type)
                        );
                      }}
                    />
                    {type}
                  </label>
                ))}
              </div>
              <SheetFooter>
                <Button variant="outline" onClick={handleCancel}>
                  Cancel
                </Button>
              </SheetFooter>
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
                new Date(
                  a.programDetails.reccurenceDate
                    ? a.programDetails.reccurenceDate
                    : a.programDetails.occurrenceDate
                ).getTime() -
                new Date(
                  b.programDetails.reccurenceDate
                    ? b.programDetails.reccurenceDate
                    : b.programDetails.occurrenceDate
                ).getTime()
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
