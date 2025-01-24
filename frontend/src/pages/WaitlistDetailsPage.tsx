import WaitlistDetailsComponent from "@/components/WaitlistTrainingSession/WaitlistDetailsComponent.tsx";
import { HeaderNav } from "@/components/HeaderNav";
import { FooterNav } from "@/components/FooterNav";

export default function WaitlistDetailsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <HeaderNav />
      <div className="flex-grow">
        <WaitlistDetailsComponent />
      </div>
      <FooterNav />
    </div>
  );
}
