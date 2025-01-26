import { CreateTrainingSessionForm } from "@/components/CreateTrainingSessionForm";
import { ToastProvider, ToastViewport } from "@radix-ui/react-toast";

export default function CreateTrainingSessionPage() {
  return (
    <div className="">
      <ToastProvider>
        <CreateTrainingSessionForm />
        <ToastViewport />
      </ToastProvider>
    </div>
  );
}
