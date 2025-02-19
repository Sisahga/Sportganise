import { Calendar } from "../ui/calendar";
import { TrainingSessionsList } from "../ViewTrainingSessions";

export default function CalendarContent() {
  return (
    <div className="mb-32 mt-5">
      <h2 className="font-semibold text-3xl text-secondaryColour text-center">
        Schedule
      </h2>

      <div className="w-[270px] justify-self-center my-5">
        <Calendar />
      </div>

      <hr className="h-px bg-gray-200 border-0 dark:bg-gray-700" />

      <TrainingSessionsList />
    </div>
  );
}
