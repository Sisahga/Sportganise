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

interface ConfirmationDialogProps {
  userId: number; // User can only share their own plans
  accountId: number | undefined | null; // Cookie Id of current user
  planId: number; // PlanId of file
  open: boolean;
  setIsOpen: (open: boolean) => void; // onOpenChange type
}

export const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  userId,
  accountId,
  planId,
  open,
  setIsOpen,
}: ConfirmationDialogProps) => {
  // States
  const { toast } = useToast();
  const { deleteTrainingPlan } = useDeleteTrainingPlan();

  // TODO: Call API hook outside of Delete to obtain function to send request
  async function handleDelete() {
    try {
      // Check That userId = accountId
      if (accountId && accountId === userId) {
        // Call API
        console.log(
          "userId deleting the file: ",
          userId,
          ", planId to delete: ",
          planId
        );
        const data = await deleteTrainingPlan(userId, planId);
        console.warn(data);
        if (!data) {
          throw new Error("The training plan was not removed.");
        }
        toast({
          title: "Successfully deleted file ✔",
          description: "The training plan was removed.",
          variant: "success",
        });
        // TODO: throw new Error("API message dto"); from API hook. Caught below.
      } else {
        throw new Error("You are not the author of this file.");
      }
    } catch (err) {
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
              setIsOpen(false);
            }}
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              handleDelete();
            }}
          >
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
