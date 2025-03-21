import { HeaderNav } from "@/components/HeaderNav";
import { FooterNav } from "@/components/FooterNav";
import WaitlistedTrainingSession from "@/components/WaitlistTrainingSession/WaitlistTrainingSession.tsx";
import { Program } from "@/types/trainingSessionDetails";
import { useNavigate } from "react-router";
import usePrograms from "@/hooks/usePrograms";
import { getCookies } from "@/services/cookiesService";

export default function WaitlistTrainingSessionPage() {
  const user = getCookies();
  const navigate = useNavigate();
  const { programs } = usePrograms(user?.accountId);

  const handleSelectTraining = (program: Program) => {
    const fullProgram = programs.find(
      (p) => p.programDetails.programId === program.programDetails.programId
    );
    if (fullProgram) {
      navigate("/pages/ViewTrainingSessionPage", { state: { programDetails: fullProgram.programDetails, attendees: fullProgram.attendees } });
    } else {
      navigate("/pages/ViewTrainingSessionPage", { state: { programDetails: program.programDetails, attendees: [] } });
    }
  };

  return (
    <div className="flex flex-col">
      <HeaderNav />
      <div className="flex-grow mx-4">
        <WaitlistedTrainingSession onSelectTraining={handleSelectTraining} />
      </div>
      <FooterNav />
    </div>
  );
}
