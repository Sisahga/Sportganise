import TrainingPlanTable from "./TrainingPlanTable";
import { AddTrainingPlanButton } from "@/components/TrainingPlan";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function TrainingPlanContent() {
  return (
    <div>
      <p className="text-2xl font-semibold text-center text-secondaryColour">
        Training Plan
      </p>
      <div className="mb-32">
        <Tabs defaultValue="mine">
          <div className="flex justify-center">
            <TabsList className="my-5">
              <TabsTrigger value="mine">My Plans</TabsTrigger>
              <TabsTrigger value="shared">Shared With Me</TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="mine">
            <TrainingPlanTable />
          </TabsContent>
          <TabsContent value="shared">
            Training Plans shared with me.
          </TabsContent>
        </Tabs>
      </div>
      <AddTrainingPlanButton />
    </div>
  );
}
