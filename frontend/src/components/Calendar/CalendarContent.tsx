import { Tabs, TabsList, TabsTrigger, TabsContent } from "../ui/tabs";
import { Calendar } from "../ui/calendar";
import { TrainingSessionsList } from "../ViewTrainingSessions";

export default function CalendarContent() {
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

      <TrainingSessionsList />
    </div>
  );
}
