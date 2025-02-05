import WaitlistedTrainingSessionList from "./WaitlistedTrainingSessionList";
import { Program } from "@/types/trainingSessionDetails.ts";

interface WaitlistTrainingSessionProps {
  onSelectTraining: (program: Program) => void;
}

export default function WaitlistTrainingSession({
  onSelectTraining,
}: WaitlistTrainingSessionProps) {
  return (
    <div className="p-6 mb-32 mt-32">
      <h1 className="text-2xl font-bold text-textColour">Waitlisted Players</h1>
      <p className="text-sm text-fadedPrimaryColour">
        The training sessions below are available for waitlisted members only.
      </p>

      <WaitlistedTrainingSessionList onSelectTraining={onSelectTraining} />
    </div>
  );
}
