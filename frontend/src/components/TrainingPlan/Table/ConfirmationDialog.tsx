// Hooks
import { useToast } from "@/hooks/use-toast";
import useDeleteTrainingPlan from "@/hooks/useDeleteTrainingPlan";
// UI Components
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
// Logs
import log from "loglevel";

// Component Props
interface ConfirmationDialogProps {
  userId: number; // User can only share their own plans
  accountId: number | undefined | null; // Cookie Id of current user
  planId: number; // PlanId of file
  open: boolean; // Dialog state
  setIsOpen: (open: boolean) => void; // onOpenChange type
}

export const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  userId,
  accountId,
  planId,
  open,
  setIsOpen,
}: ConfirmationDialogProps) => {
  log.info("Rendered ConfirmationDialog");

  // States
  const { toast } = useToast();
  const { deleteTrainingPlan } = useDeleteTrainingPlan(); // Function to call API Delete

  // Handle Delete
  async function handleDelete() {
    try {
      // Check That userId = accountId
      if (accountId && accountId === userId) {
        log.info(
          `${userId} deleting the file is userId and planId to delete is ${planId}`,
        );
        // Call API
        const data = await deleteTrainingPlan(userId, planId);
        // Check For Null Response
        if (!data) {
          log.error(
            "ConfirmationDialog -> 'data' is null. The training plan was not removed.",
          );
          throw new Error("The training plan was not removed.");
        }
        // Success
        log.info(
          "ConfirmationDialog -> Success. The training plan was removed.",
        );
        toast({
          title: "Successfully deleted file ✔",
          description: "The training plan was removed.",
          variant: "success",
        });
      } else {
        // userId != accountId
        log.error("ConfirmationDialog -> You are not the author of this file.");
        throw new Error("You are not the author of this file.");
      }
    } catch (err) {
      // Error containing Dto message caught from API
      log.error("ConfirmationDialog -> Error thrown!", err);
      toast({
        title: "Training plan could not be deleted ✖",
        description: String(err),
        variant: "destructive",
      });
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={setIsOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete selected training plan?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the
            selected training plan.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            onClick={() => {
              setIsOpen(false); // Cancel and close modal
            }}
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              handleDelete(); // Call deletehandling and API
            }}
          >
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
