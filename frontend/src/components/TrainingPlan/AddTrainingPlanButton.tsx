import { Plus } from "lucide-react";
import UploadTrainingPlanFiles from "./UploadTrainingPlanForm";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export default function AddTrainingPlanButton() {
  return (
    <div>
      <Sheet>
        <SheetTrigger asChild>
          <div
            aria-label="Add new item"
            className="fixed bottom-20 right-5 bg-secondaryColour text-white p-4 rounded-full shadow-lg hover:bg-cyan-500 focus:outline-none flex items-center justify-center"
          >
            <Plus />
          </div>
        </SheetTrigger>
        <SheetContent side="bottom">
          <SheetHeader>
            <SheetTitle>Upload Training Plan(s)</SheetTitle>
            <SheetDescription>
              You can upload one or many files.
            </SheetDescription>
          </SheetHeader>
          <UploadTrainingPlanFiles />
        </SheetContent>
      </Sheet>
    </div>
  );
}
