import { useState } from "react";
import { HeaderNav } from "@/components/HeaderNav";
import { FooterNav } from "@/components/FooterNav";
import WaitlistedTrainingSession from "@/components/WaitlistTrainingSession/WaitlistTrainingSession.tsx";
import WaitlistDetailsComponent from "@/components/WaitlistTrainingSession/WaitlistDetailsComponent";
import { Button } from "@/components/ui/Button";
import { Program } from "@/types/trainingSessionDetails";

export default function WaitlistTrainingSessionPage() {
  const [selectedTraining, setSelectedTraining] = useState<Program | null>(
    null,
  );

  return (
    <div className="flex flex-col ">
      <HeaderNav />
      <div className="flex-grow mx-4">
        {selectedTraining ? (
          <>
            <Button className="mb-4" onClick={() => setSelectedTraining(null)}>
              ← Back
            </Button>
            <WaitlistDetailsComponent
              programDetails={selectedTraining.programDetails}
            />
          </>
        ) : (
          <WaitlistedTrainingSession onSelectTraining={setSelectedTraining} />
        )}
      </div>
      <FooterNav />
    </div>
  );
}
