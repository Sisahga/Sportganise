import { AddTrainingPlanButton } from "@/components/TrainingPlan";
import { TrainingPlanTable } from "@/components/TrainingPlan";

export default function TrainingPlanPage() {
  return (
    <div>
      <TrainingPlanTable />
      <AddTrainingPlanButton />
    </div>
  );
}
