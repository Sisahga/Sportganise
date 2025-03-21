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
import { LogIn } from "lucide-react";
import { Attendees } from "@/types/trainingSessionDetails";
import log from "loglevel";
import useOptInParticipant from "@/hooks/useOptInParticipant";
import { createPortal } from "react-dom";

interface OptInButton {
  accountAttendee: Attendees | undefined;
  programId: number;
  accountId: number | undefined;
  onClose: () => void;
}

export const OptInButton: React.FC<OptInButton> = ({
  accountAttendee,
  programId,
  accountId,
  onClose,
}) => {
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [isConfirmationVisible, setConfirmationVisible] = useState(false);
  const {loading, error, data: rank, optIn } = useOptInParticipant();
  // Only show the opt-in button if the attendee is of type "waitlist" and has a rank
  const isWaitlisted = accountAttendee?.participantType?.toLowerCase() === "waitlisted" && accountAttendee?.rank === null && accountAttendee?.confirmed === false;
  
  if (!isWaitlisted) {
    return null;
  }

  const handleOptInClick = () => {
    setDialogOpen(true);
  };

  const handleOptInConfirmation = async () => {
    try{
      await optIn(programId, accountId);
      setDialogOpen(false);
      setConfirmationVisible(true);  
      setTimeout(() => {
        setConfirmationVisible(false);  
        onClose();
      }, 3000);
    }catch(err) {
      log.error("Error during opt-out:", err);
    }
  };

  return (
    <>
      <DropdownMenuItem onMouseDown={(e) => { e.preventDefault(); handleOptInClick(); }}>
        <LogIn color="blue" />
        <span className="text-blue-500">Opt Into Waitlist</span>
      </DropdownMenuItem>

      {/* Confirmation Dialog */}
      <AlertDialog open={isDialogOpen}>
        <AlertDialogContent className="max-w-xs sm:max-w-sm md:max-w-lg overflow-y-auto max-h-[90vh] rounded-lg">
          <AlertDialogHeader>
            <AlertDialogTitle>
              Join the waitlist?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to opt into the waitlist?
            </AlertDialogDescription>
            {error && <p className="text-red-500">{error}</p>}
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDialogOpen(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleOptInConfirmation} disabled={loading}>
              {loading ? "Preprocessing..." : "Confirm"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Confirmation Message */}
      {isConfirmationVisible && createPortal(
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
        <div className="bg-teal-500 text-white p-4 rounded-lg shadow-lg max-w-md w-full m-4">
          <p className="text-center text-lg font-medium">
            You have successfully opted into the waitlist.
            {rank && <span> Your position is #{rank}.</span>}
          </p>
        </div>
      </div>,
      document.body
      )}
    </>
  );
};

export default OptInButton;