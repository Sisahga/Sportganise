import { useState } from "react";
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
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { LogOut } from "lucide-react";
import { Attendees } from "@/types/trainingSessionDetails";
import log from "loglevel";
import useOptOutParticipant from "@/hooks/useRejectParticipant";
import { createPortal } from "react-dom";
import useRejectParticipant from "@/hooks/useRejectParticipant";

interface OptOutButtonProps {
  accountAttendee: Attendees | undefined;
  programId: number;
  accountId: number | null | undefined;
  onClose: () => void;
}

export const OptOutButton: React.FC<OptOutButtonProps> = ({
  accountAttendee,
  programId,
  accountId,
  onClose,
}) => {
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [isConfirmationVisible, setConfirmationVisible] = useState(false);
  const { rejecting, error, rejectParticipant } = useRejectParticipant();
  
  // Only show the opt-out button if the attendee is of type "waitlisted" and has a rank
  const isWaitlisted = accountAttendee?.participantType?.toLowerCase() === "waitlisted" && 
                       accountAttendee?.rank !== null && 
                       accountAttendee?.confirmed === false;
  
  if (!isWaitlisted) {
    return null;
  }

  const handleOptOutClick = () => {
    setDialogOpen(true);
  };

  const handleOptOutConfirmation = async () => {
    try {
      if (accountId) await rejectParticipant(programId, accountId);
      setDialogOpen(false);
      setConfirmationVisible(true);  
      setTimeout(() => {
        setConfirmationVisible(false);  
        onClose();
      }, 3000);
    } catch(err) {
      log.error("Error during opt-out:", err);
    }
  };

  return (
    <>
      <DropdownMenuItem onMouseDown={(e) => { e.preventDefault(); handleOptOutClick(); }}>
        <LogOut color="red" />
        <span className="text-red-500">Leave Waitlist</span>
      </DropdownMenuItem>

      {/* Confirmation Dialog */}
      <AlertDialog open={isDialogOpen}>
        <AlertDialogContent className="max-w-xs sm:max-w-sm md:max-w-lg overflow-y-auto max-h-[90vh] rounded-lg">
          <AlertDialogHeader>
            <AlertDialogTitle>
              Leave the waitlist?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to opt out of the waitlist? You are currently position #{accountAttendee?.rank}.
            </AlertDialogDescription>
            {error && <p className="text-red-500">{error}</p>}
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDialogOpen(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleOptOutConfirmation} disabled={rejecting}>
              {rejecting ? "Processing..." : "Confirm"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Confirmation Message */}
      {isConfirmationVisible && createPortal(
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-teal-500 text-white p-4 rounded-lg shadow-lg max-w-md w-full m-4">
            <p className="text-center text-lg font-medium">
              You have successfully left the waitlist.
            </p>
          </div>
        </div>,
        document.body
      )}
    </>
  );
};

export default OptOutButton;