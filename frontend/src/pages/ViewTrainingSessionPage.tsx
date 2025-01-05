import { ViewRegisteredPlayersContent } from "@/components/ViewRegisteredPlayers";
import { TrainingSessionsList } from "@/components/ViewTrainingSessions";
import { TrainingSessionContent } from "@/components/ViewTrainingSessions";

export default function ViewTrainingSessionPage() {
  return (
    <div className="">
      {/*<ViewRegisteredPlayersContent >*/}
      <TrainingSessionContent />
      <TrainingSessionsList />
    </div>
  );
}
