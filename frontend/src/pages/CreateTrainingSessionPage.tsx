import { CreateTrainingSessionForm } from "@/components/CreateTrainingSessionForm";
import { ToastProvider, ToastViewport } from "@radix-ui/react-toast";

export default function CreateTrainingSession() {
  return (
    <div className="">
      <ToastProvider>
        <CreateTrainingSessionForm />
        <ToastViewport />
      </ToastProvider>
    </div>
  );
}
