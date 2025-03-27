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

      <div className="w-[270px] justify-self-center my-5">
        <Calendar
        mode="single"
        selected={selectedDate}
        onSelect={setSelectedDate}
        selectedMonth={selectedMonth}
        onMonthChange={setSelectedMonth}
        programsProp={programsProp}
        />
      </div>

      <hr className="h-px bg-gray-200 border-0 dark:bg-gray-700" />

      <TrainingSessionsList
        selectedMonth={selectedMonth}
        programsProp={programsProp}
        selectedDate={selectedDate}
      />
    </div>
  );
}
