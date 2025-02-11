// React
import { useState } from "react";
import { useEffect } from "react";
// Services
import { getCookies, getAccountIdCookie } from "@/services/cookiesService";
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
import { Ellipsis, Share, Trash2 } from "lucide-react";
// Logs
import log from "loglevel";

// Component Props
interface DropDownMenuProps {
  userId: number;
  planId: number;
}

export const DropDownMenu: React.FC<DropDownMenuProps> = ({
  userId,
  planId,
}: DropDownMenuProps) => {
  log.info("Rendered DropDownMenu");

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
            <DropdownMenuItem
              onClick={() => {
                log.debug("TableColumns -> Sharing planId", planId);
              }}
            >
              <Share />
              <span>Share</span>
            </DropdownMenuItem>
            {accountId === userId && (
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
