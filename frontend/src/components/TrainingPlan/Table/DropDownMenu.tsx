// React
import { useState } from "react";
import { useEffect } from "react";
// Services
import { getCookies, getAccountIdCookie } from "@/services/cookiesService";
// Hooks
import useShareTrainingPlan from "@/hooks/useShareTrainingPlan";
import { useToast } from "@/hooks/use-toast";
// UI Components
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/Button";
// Custom Components
import { ConfirmationDialog } from "./ConfirmationDialog";
// Icons
import { CircleDotDashed, Ellipsis, Share, Trash2 } from "lucide-react";
// Logs
import log from "loglevel";

// Component Props
interface DropDownMenuProps {
  userId: number;
  planId: number;
  shared: boolean;
}

export const DropDownMenu: React.FC<DropDownMenuProps> = ({
  userId,
  planId,
  shared,
}: DropDownMenuProps) => {
  log.info("Rendered DropDownMenu");
  // Hooks
  const { shareTrainingPlan } = useShareTrainingPlan();
  const { toast } = useToast();

  // State Management
  const [isConfirmationDialogOpen, setIsConfirmationDialogOpen] =
    useState(false); // Handle dialog open, close set by dialog component

  // Get AccountId From Cookie
  const cookies = getCookies();
  const accountId = cookies ? getAccountIdCookie(cookies) : null;
  useEffect(() => {
    if (!accountId) {
      log.debug("TrainingPlanContent -> No accountId found");
    }
    log.info(`TrainingPlanContent -> accountId is ${accountId}`);
  }, [accountId]);

  // Share a Training Plan
  async function handleShare(userId: number, planId: number) {
    try {
      // Call API
      const data = await shareTrainingPlan(userId, planId);
      // Check For Null Response
      if (!data) {
        throw new Error("The training plan was not shared.");
      }
      // Success
      toast({
        title: "Successfully shared file ✔",
        description: "The training plan was shared with all coaches.",
        variant: "success",
      });
      // Reload page to see "unshared" changed to "shared" in dropdown menu
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (err) {
      toast({
        title: "Training plan could not be shared ✖",
        description: String(err),
        variant: "destructive",
      });
    }
  } // Deleting training plan is in separate component

  // Unshare Training Plan
  async function handleUnshare(userId: number, planId: number) {
    try {
      // Call API
      const data = await shareTrainingPlan(userId, planId);
      // Check For Null Response
      if (!data) {
        throw new Error("The training plan was not shared.");
      }
      // Success
      toast({
        title: "Successfully unshared file ✔",
        description: "The training plan was unshared from all coaches",
        variant: "success",
      });
    } catch (err) {
      toast({
        title: "Training plan could not be unshared ✖",
        description: String(err),
        variant: "destructive",
      });
    }
  }

  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-6 w-6">
            <Ellipsis />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuLabel>Options</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            {shared ? (
              <DropdownMenuItem
                onClick={() => {
                  log.debug("TableColumns -> Unshare planId", planId);
                  handleUnshare(userId, planId);
                }}
              >
                <CircleDotDashed />
                <span>Unshare</span>
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem
                onClick={() => {
                  log.debug("TableColumns -> Sharing planId", planId);
                  handleShare(userId, planId);
                }}
              >
                <Share />
                <span>Share</span>
              </DropdownMenuItem>
            )}

            {accountId && accountId === userId && (
              <DropdownMenuItem
                onClick={() => {
                  log.debug("TableColumns -> Deleting planId", planId);
                  setIsConfirmationDialogOpen(true);
                }}
              >
                <Trash2 color="red" />
                <span className="text-red">Delete</span>
              </DropdownMenuItem>
            )}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      <ConfirmationDialog
        planId={planId}
        accountId={accountId}
        userId={userId}
        open={isConfirmationDialogOpen}
        setIsOpen={setIsConfirmationDialogOpen}
      />
    </div>
  );
};
