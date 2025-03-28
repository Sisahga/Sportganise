/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState, useEffect } from "react";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import TrainingSessionCard from "./TrainingSessionCard";
import usePrograms from "@/hooks/usePrograms";
import { Program } from "@/types/trainingSessionDetails";
import { getAccountIdCookie, getCookies } from "@/services/cookiesService";
import {
  Drawer,
  DrawerTrigger,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from "@/components/ui/drawer";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/Button";
import { Checkbox } from "@/components/ui/checkbox";
import { Filter, Loader2, X } from "lucide-react";
import log from "loglevel";
import { isSameDay, isWithinInterval  } from 'date-fns';

export default function TrainingSessionsList({
  selectedMonth,
  programsProp,
  selectedDate,
}: {
  selectedDate?: Date;
  selectedMonth: Date;
  programsProp: ReturnType<typeof usePrograms>;
}) {
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
  const { programs, error, loading, fetchPrograms } = programsProp;
  useEffect(() => {
    console.log("TrainingSessionList : Programs fetched:", programs);
    log.info("TrainingSessionList : Programs fetched:", programs);
  }, [programs]); // update page if changes in programs occur

  // Date Range For This Week
  const today = new Date(); // get today's date
  const todayDayIndex = today.getDay(); // index of today's day of the week
  const startOfWeek = new Date(today); // same day as today
  log.debug(
    `Today's date is ${today.getDate()} and today's index day number is ${todayDayIndex}. So, the start date of the week is ${today.getDate() - todayDayIndex}`,
  );
  startOfWeek.setDate(today.getDate() - todayDayIndex); // start of the week date = today's date - day of week
  const endOfWeek = new Date(today); // same day as today
  log.debug(
    `Today's date is ${today.getDate()} and today's index number is ${todayDayIndex}. So, the end date of the week is ${today.getDate() + (6 - todayDayIndex)}`,
  );
  endOfWeek.setDate(today.getDate() + (6 - todayDayIndex)); // end of week date = today's date + nb of days left in week

  const startOfMonth = new Date(
    selectedMonth.getFullYear(),
    selectedMonth.getMonth(),
    1,
  ); // First day of the current month

  const endOfMonth = new Date(
    selectedMonth.getFullYear(),
    selectedMonth.getMonth() + 1,
    0,
  ); // Last day of the month

  // Start Date Range
  const [dateRange, setDateRange] = useState([
    {
      startDate: startOfWeek, // this week
      endDate: endOfWeek,
      key: "selection",
    },
  ]);

  useEffect(() => {
    if (!accountId) return;

    const prevStart = dateRange[0].startDate;
    const prevEnd = dateRange[0].endDate;

    if (
      prevStart.getTime() !== startOfMonth.getTime() ||
      prevEnd.getTime() !== endOfMonth.getTime()
    ) {
      setDateRange([
        {
          startDate: startOfMonth,
          endDate: endOfMonth,
          key: "selection",
        },
      ]);
    }
  }, [accountId, selectedMonth]);

  useEffect(() => {
    if (!accountId || !dateRange[0].startDate || !dateRange[0].endDate) return;

    const { startDate, endDate } = dateRange[0];
    fetchPrograms(accountId, startDate, endDate);
  }, [
    accountId,
    dateRange[0].startDate.getTime(),
    dateRange[0].endDate.getTime(),
  ]);

  // Handle Selected Program Type
  const [selectedProgramType, setSelectedProgramType] = useState<string[]>([]);
  // List of programDetails.programTypes For Check
  const programTypes = Array.from(
    new Set(programs.map((program) => program.programDetails.programType)),
  );

  // Filter Programs by Date Range
  const filteredPrograms: Program[] = programs.filter((program) => {
    const programDate = new Date(
      program.programDetails.reccurenceDate
        ? program.programDetails.reccurenceDate
        : program.programDetails.occurrenceDate,
    );
    programDate.setHours(0, 0, 0, 0); // to compare the dateRange and occurenceDate regardless of time
    if (selectedDate) {
      // If a specific date is selected, filter by that date
      const dateFilter = isSameDay(programDate, selectedDate);
      const typeFilter =
        selectedProgramType.length === 0 ||
        selectedProgramType.includes(program.programDetails.programType);
      return dateFilter && typeFilter;
    }

    const dateFilter = 
    isWithinInterval(programDate, {
      start: dateRange[0].startDate,
      end: dateRange[0].endDate
    });
  
  const typeFilter =
    selectedProgramType.length === 0 ||
    selectedProgramType.includes(program.programDetails.programType);
  
  return dateFilter && typeFilter;
});

  function handleDateChange(item: any) {
    const newStartDate = new Date(item.selection.startDate);
    const newEndDate = new Date(item.selection.endDate);

    setDateRange([
      {
        startDate: newStartDate,
        endDate: newEndDate,
        key: "selection",
      },
    ]);

    fetchPrograms(accountId, newStartDate, newEndDate);
  }

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
            {selectedDate 
              ? `Programs on ${selectedDate.toLocaleDateString()}` 
              : "Upcoming Programs"}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            {selectedDate 
              ? selectedDate.toLocaleDateString() 
              : `${dateRange[0].startDate.toLocaleDateString()} - ${dateRange[0].endDate.toLocaleDateString()}`}
          </p>
        </div>

          {/**Filters */}
          <Drawer direction="bottom">
            <DrawerTrigger asChild>
              <Button variant="outline" className="w-6 ml-auto">
                <Filter className="text-secondaryColour w-3 h-3" />
              </Button>
            </DrawerTrigger>
            <DrawerContent>
              <DrawerHeader className="flex flex-col items-center text-center relative">
                {/* Close button*/}
                <DrawerClose asChild>
                  <Button
                    variant="ghost"
                    className="text-fadedPrimaryColour rounded-full absolute top-5 left-4 w-2"
                  >
                    <X></X>
                  </Button>
                </DrawerClose>
                <DrawerTitle>Filter Options</DrawerTitle>
                <DrawerDescription>
                  Customize your program filters
                </DrawerDescription>
              </DrawerHeader>

              <Separator className="border border-secondaryColour" />

              <ScrollArea className="h-[80vh]">
                <div className="px-6 mb-2 mt-8 flex flex-col">
                  {/**Filter by date range */}
                  <div className="space-y-4">
                    <h3 className="text-base font-semibold text-center">
                      Filter by date
                    </h3>
                    <div className="overflow-auto my-3 flex justify-center items-center">
                      <DateRange
                        editableDateInputs={true}
                        onChange={handleDateChange} //  Ensures state is updated
                        moveRangeOnFirstSelection={false}
                        ranges={dateRange} //  Uses updated `dateRange`
                      />
                    </div>
                  </div>
                  <Separator />
                  {/**Filter by program type */}
                  <div className="flex flex-col gap-1 mt-6">
                    <h3 className="text-base font-semibold mb-2 text-center">
                      Filter by type
                    </h3>
                    {programTypes.map((type, index) => (
                      <label
                        key={index}
                        className="text-sm flex gap-2 items-center"
                      >
                        <Checkbox
                          checked={selectedProgramType.includes(type)}
                          onCheckedChange={(checked) => {
                            setSelectedProgramType((prev) =>
                              checked
                                ? [...prev, type]
                                : prev.filter((t) => t !== type),
                            );
                          }}
                        />
                        {type}
                      </label>
                    ))}
                  </div>
                  {/**Cancel filters button */}
                  <Button
                    className="px-12 mt-8 mb-4"
                    variant="outline"
                    onClick={handleCancel}
                  >
                    Cancel
                  </Button>
                   {/**Done button */}
                   <DrawerClose asChild>
                    <Button
                      className="px-12 mt-2 mb-8 bg-secondaryColour hover:bg-transparent hover:text-primaryColour hover:border-navbar"
                    >
                      Done
                    </Button>
                  </DrawerClose>
                </div>
              </ScrollArea>
            </DrawerContent>
          </Drawer>
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
                    : a.programDetails.occurrenceDate,
                ).getTime() -
                new Date(
                  b.programDetails.reccurenceDate
                    ? b.programDetails.reccurenceDate
                    : b.programDetails.occurrenceDate,
                ).getTime(),
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
