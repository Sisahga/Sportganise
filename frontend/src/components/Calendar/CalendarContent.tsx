import { Calendar } from "../ui/calendar";
import { TrainingSessionsList } from "../ViewTrainingSessions";
import { useState } from "react";
import usePrograms from "@/hooks/usePrograms";

export default function CalendarContent() {
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

  // Shared instance of usePrograms() hook that will be passed down as a prop to other components
  const programsProp = usePrograms();

  return (
    <div className="mb-32 mt-5">
      <h2 className="font-semibold text-3xl text-secondaryColour text-center">
        Schedule
      </h2>

      <div
        className="flex flex-col items-center gap-8 lg:flex-row justify-center lg:mt-8
                        lg:items-start lg:gap-12 mt-4 lg:mx-12 xl:mx-48"
      >
        <div className="p-4 shadow rounded-xl bg-white lg:w-1/2 md:w-1/2 sm:w-2/3 w-full">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            selectedMonth={selectedMonth}
            onMonthChange={setSelectedMonth}
            programsProp={programsProp}
          />
        </div>
        <div className="lg:w-1/2 w-full">
          <TrainingSessionsList
            selectedMonth={selectedMonth}
            programsProp={programsProp}
            selectedDate={selectedDate}
          />
        </div>
      </div>
    </div>
  );
}
