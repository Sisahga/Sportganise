import { ViewRegisteredPlayersContent } from "@/components/ViewRegisteredPlayers";
import { TrainingSessionsList } from "@/components/ViewTrainingSessions";

export default function ViewTrainingSessionPage() {
  return (
    <div className="">
      <ViewRegisteredPlayersContent />
      <TrainingSessionsList />
    </div>
  );
}
