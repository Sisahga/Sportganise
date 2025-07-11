import { ModifyTrainingSessionForm } from "@/components/TrainingSessionForm";
import { ToastProvider, ToastViewport } from "@radix-ui/react-toast";

export default function ModifyTrainingSessionPage() {
  return (
    <div className="">
      <ToastProvider>
        <ModifyTrainingSessionForm />
        <ToastViewport />
      </ToastProvider>
    </div>
  );
}
