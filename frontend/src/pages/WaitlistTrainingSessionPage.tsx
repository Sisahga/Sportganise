import { WaitlistTrainingSession } from "@/components/WaitlistTrainingSession";
import { HeaderNav } from "@/components/HeaderNav";
import { FooterNav } from "@/components/FooterNav";

export default function WaitlistTrainingSessionPage() {
  return (
    <div className="flex flex-col min-h-screen ">
      <HeaderNav />
      <div className="flex-grow">
        <WaitlistTrainingSession />
      </div>
      <FooterNav />
    </div>
  );
}
