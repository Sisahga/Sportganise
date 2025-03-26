import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  EllipsisVertical,
  Pencil,
  Trash2,
  LogOut,
  Frown,
  Smile,
  LogIn,
  Ban,
} from "lucide-react";
import { useNavigate } from "react-router";
import {
  Attendees,
  Program,
  ProgramDetails,
} from "@/types/trainingSessionDetails";
import log from "loglevel";
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
import useAbsent from "@/hooks/useAbsent";
import { CookiesDto } from "@/types/auth";
import OptInButton from "./OptInButton";
import OptOutButton from "./OptOutButton";

interface DropDownMenuButtonProps {
  user: CookiesDto | null | undefined;
  accountAttendee: Attendees | undefined;
  programDetails: ProgramDetails;
  attendees: Attendees[];
  onRefresh: () => void;
}

export const DropDownMenuButton: React.FC<DropDownMenuButtonProps> = ({
  user,
  accountAttendee,
  programDetails,
  attendees,
  onRefresh,
}: DropDownMenuButtonProps) => {
  const navigate = useNavigate();
  const handleNavigation = (path: string, data: Program) => {
    navigate(path, { state: data });
  };
  log.info("DropDownMenuButton programDetails: ", programDetails);
  log.debug("Rendering DropDownMenuButton for TrainingSessionContent");

  //Confirmation of player absence
  const { markAbsent, error: absentError } = useAbsent();
  const [isNotificationVisible, setNotificationVisible] = useState(false);
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [isRSVPDialogOpen, setRSVPDialogOpen] = useState(false);
  const [isRSVPConfirmationVisible, setRSVPConfirmationVisible] =
    useState(false);
  const [isAbsentDialogOpen, setAbsentDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isPostponeDialogOpen, setPostponeDialogOpen] = useState(false);
  const [isOptedIn, setIsOptedIn] = useState(false);
  const [isPostponeConfirmationVisible, setPostponeConfirmationVisible] =
    useState(false);
  const [isDeleteConfirmationVisible, setDeleteConfirmationVisible] =
    useState(false);

  const handleDeleteClick = () => {
    setDropdownOpen(false); //Close the dropdown
    setDeleteDialogOpen(true); // Open the alert dialog
  };

  const handleDeleteConfirmation = () => {
    setDeleteDialogOpen(false);
    setDeleteConfirmationVisible(true);
    if (onRefresh) onRefresh();

    setTimeout(() => {
      setDeleteConfirmationVisible(false);
    }, 3000);
  };

  const handlePostponeClick = () => {
    setDropdownOpen(false); //Close the dropdown
    setPostponeDialogOpen(true); // Open the alert dialog
  };

  const handlePostponeConfirmation = () => {
    setPostponeDialogOpen(false);
    setPostponeConfirmationVisible(true); // Show postpone confirmation message
    if (onRefresh) onRefresh();

    setTimeout(() => {
      setPostponeConfirmationVisible(false);
    }, 3000);
  };

  const handleRSVPClick = () => {
    setDropdownOpen(false); // Close the dropdown immediately
    setRSVPDialogOpen(true); // Open the alert dialog
  };

  const handleRSVPConfirmation = () => {
    setRSVPDialogOpen(false);
    setRSVPConfirmationVisible(true); // Show RSVP confirmation message
    if (onRefresh) onRefresh();

    setTimeout(() => {
      setRSVPConfirmationVisible(false);
    }, 3000);
  };

  const handleAbsentClick = () => {
    setDropdownOpen(false); // Close the dropdown immediately
    setAbsentDialogOpen(true); // Open the alert dialog
  };

  const handleAbsentConfirmation = async () => {
    try {
      await markAbsent(programDetails.programId, user?.accountId);
      setAbsentDialogOpen(false);
      setNotificationVisible(true);
      if (onRefresh) onRefresh();
      console.log("Updated account?: ", accountAttendee);
      setTimeout(() => {
        setNotificationVisible(false);
      }, 3000);
    } catch {
      console.log("Error marking the user as absent in DropDownMenuButton");
    }
  };

  return (
    <div>
      <DropdownMenu open={isDropdownOpen} onOpenChange={setDropdownOpen}>
        <DropdownMenuTrigger asChild>
          <button
            aria-label="Add new item"
            className="fixed bottom-24 right-5 bg-secondaryColour text-white p-4 rounded-full shadow-lg hover:bg-cyan-500 focus:outline-none flex items-center justify-center"
          >
            <EllipsisVertical />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuLabel>Options</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {user?.type?.toLowerCase() === "coach" ||
          user?.type?.toLowerCase() === "admin" ? (
            <DropdownMenuGroup>
              <DropdownMenuItem
                onClick={() =>
                  handleNavigation("/pages/ModifyTrainingSessionPage", {
                    programDetails,
                    attendees,
                  })
                }
              >
                <Pencil />
                <span>Edit Event</span>
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={handlePostponeClick}>
                <Ban color="gray" />
                <span>Postpone Event</span>
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={handleDeleteClick}>
                <Trash2 color="red" />
                <span className="text-red">Delete Event</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          ) : (
            <DropdownMenuGroup>
              <DropdownMenuItem onSelect={handleRSVPClick}>
                <LogIn color="green" />
                <span className="text-green-500">RSVP</span>
              </DropdownMenuItem>
              {/* Here instead I want to check if a player is of role waitlisted */}
              {accountAttendee?.confirmed === true && (
                <DropdownMenuItem onSelect={handleAbsentClick}>
                  <LogOut color="red" />
                  <span className="text-red"> Mark absent </span>
                </DropdownMenuItem>
              )}
              {accountAttendee?.participantType?.toLowerCase() ===
                "waitlisted" &&
                accountAttendee?.rank === null &&
                !isOptedIn && (
                  <OptInButton
                    accountAttendee={accountAttendee}
                    programId={programDetails.programId}
                    accountId={user?.accountId}
                    onClose={() => {
                      setDropdownOpen(false);
                      setIsOptedIn(true);
                    }}
                  />
                )}

              {/* Opt-out button */}
              {accountAttendee?.rank !== null && (
                <OptOutButton
                  accountAttendee={accountAttendee}
                  programId={programDetails.programId}
                  accountId={user?.accountId}
                  onClose={() => {
                    setDropdownOpen(false);
                  }}
                />
              )}
            </DropdownMenuGroup>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Pop up when coach/admin postpones an event*/}
      <AlertDialog
        open={isPostponeDialogOpen}
        onOpenChange={setPostponeDialogOpen}
      >
        <AlertDialogContent className="max-w-xs sm:max-w-sm md:max-w-lg overflow-y-auto max-h-[90vh]">
          <AlertDialogHeader>
            <AlertDialogTitle>
              Would you like to postpone this event?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This event will be postponed until you decide to reinstate it.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setPostponeDialogOpen(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handlePostponeConfirmation}>
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Pop up when coach/admin deletes an event*/}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="max-w-xs sm:max-w-sm md:max-w-lg overflow-y-auto max-h-[90vh] rounded-lg">
          <AlertDialogHeader>
            <AlertDialogTitle>
              Would you like to delete this event?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This event will be deleted permanently.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirmation}>
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Pop up when player RSVP's to event */}
      <AlertDialog open={isRSVPDialogOpen} onOpenChange={setRSVPDialogOpen}>
        <AlertDialogContent className="max-w-xs sm:max-w-sm md:max-w-lg overflow-y-auto max-h-[90vh] rounded-lg">
          <AlertDialogHeader>
            <AlertDialogTitle>
              Would you like to confirm your presence?
            </AlertDialogTitle>
            <AlertDialogDescription>
              If you cannot attend the event anymore, you will have the option
              to mark yourself as absent.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setRSVPDialogOpen(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleRSVPConfirmation}>
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Pop up when player wants to leave an event */}
      <AlertDialog open={isAbsentDialogOpen} onOpenChange={setAbsentDialogOpen}>
        <AlertDialogContent className="max-w-xs sm:max-w-sm md:max-w-lg overflow-y-auto max-h-[90vh] rounded-lg">
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure you want to mark yourself as absent?
            </AlertDialogTitle>
            {absentError && <p className="text-red-500">{absentError}</p>}
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setAbsentDialogOpen(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleAbsentConfirmation}>
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Postpone event confirmation message */}
      {isPostponeConfirmationVisible && (
        <div className="fixed inset-0 flex items-center justify-center px-4 max-w-ws sm:max-w-sm md:max-w-md">
          <div className="bg-teal-500 text-white p-4 rounded-lg flex flex-col items-center space-y-2">
            <Frown className="w-12 h-12" />
            <p className="text-center">
              You have successfully postponed the event. The participants will
              be notified.
            </p>
          </div>
        </div>
      )}

      {/* Postpone event confirmation message */}
      {isDeleteConfirmationVisible && (
        <div className="fixed inset-0 flex items-center justify-center px-4 max-w-ws sm:max-w-sm md:max-w-md">
          <div className="bg-teal-500 text-white p-4 rounded-lg flex flex-col items-center space-y-2">
            <Frown className="w-12 h-12" />
            <p className="text-center">
              You have successfully deleted the event. The participants will be
              notified.
            </p>
          </div>
        </div>
      )}

      {/* RSVP confirmation message */}
      {isRSVPConfirmationVisible && (
        <div className="fixed inset-0 flex items-center justify-center px-4 max-w-ws sm:max-w-sm md:max-w-md">
          <div className="bg-teal-500 text-white p-4 rounded-lg flex flex-col items-center space-y-2">
            <Smile className="w-12 h-12" />
            <p className="text-center">
              Your presence is noted. Can&#39;t wait to see you!
            </p>
          </div>
        </div>
      )}

      {/* Notification when player confirms absence */}
      {isNotificationVisible && (
        <div className="fixed inset-0 flex items-center justify-center px-4 max-w-ws sm:max-w-sm md:max-w-md">
          <div className="bg-teal-500 text-white p-4 rounded-lg shadow-lg flex flex-col items-center space-y-2">
            <Frown className="w-12 h-12" />
            <p className="text-center">Your absence is noted.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default DropDownMenuButton;
