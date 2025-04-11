import { useEffect, useState } from "react";
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
import useRSVP from "@/hooks/useRSVP";
import programParticipantApi from "@/services/api/programParticipantApi";
import useDeleteProgram from "@/hooks/useDeleteProgram";
import { useToast } from "@/hooks/use-toast";

interface DropDownMenuButtonProps {
  user: CookiesDto | null | undefined;
  accountAttendee: Attendees | undefined;
  programDetails: ProgramDetails;
  attendees: Attendees[];
  onRefresh: () => void;
  updateAttendeesList?: (attendess: Attendees) => void;
}

export const DropDownMenuButton: React.FC<DropDownMenuButtonProps> = ({
  user,
  accountAttendee,
  programDetails,
  attendees,
  onRefresh,
  updateAttendeesList,
}: DropDownMenuButtonProps) => {
  const navigate = useNavigate();
  const handleNavigation = (path: string, data: Program) => {
    navigate(path, { state: data });
  };
  log.info("DropDownMenuButton programDetails: ", programDetails);
  log.debug("Rendering DropDownMenuButton for TrainingSessionContent");

  //Confirmation of player absence
  const { rsvp, isLoading: rsvpLoading } = useRSVP();
  const [attendee, setAttendee] = useState<Attendees | undefined>(
    accountAttendee,
  );
  //const [rsvpErrorMessage, setRsvpErrorMessage] = useState<string | null>(null);
  const { markAbsent, error: absentError } = useAbsent();
  const { deleteProgram } = useDeleteProgram();
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
  const { toast } = useToast();

  useEffect(() => {
    setAttendee(accountAttendee);
  }, [accountAttendee]);

  const refreshAttendee = async () => {
    if (!user?.accountId || !programDetails?.programId) return;
    try {
      const updated = await programParticipantApi.getProgramParticipant(
        programDetails.programId,
        user.accountId,
      );
      setAttendee(updated);
      if (
        updateAttendeesList &&
        (user?.type?.toLowerCase() === "player" ||
          user?.type?.toLowerCase() === "general") &&
        updated?.confirmed
      ) {
        updateAttendeesList(updated);
      }
    } catch {
      setAttendee(undefined); // reset if not found
    }
  };

  const handleDeleteClick = () => {
    setDropdownOpen(false); //Close the dropdown
    setDeleteDialogOpen(true); // Open the alert dialog
  };

  const handleDeleteConfirmation = async () => {
    setDeleteDialogOpen(false);
    setDeleteConfirmationVisible(true);

    const response = await deleteProgram(
      user?.accountId,
      programDetails.programId,
    );

    if (response) {
      if (onRefresh) onRefresh();
      setTimeout(() => {
        setDeleteConfirmationVisible(false);
      }, 3000);
    }
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

  const handleRSVPConfirmation = async () => {
    if (!user?.accountId || !programDetails?.programId) return;

    const visibility = programDetails.visibility?.toLowerCase();
    const isPrivate = visibility === "private";

    try {
      // Get participant info (if exists)
      let participant: Attendees | null = null;
      try {
        participant = await programParticipantApi.getProgramParticipant(
          programDetails.programId,
          user.accountId,
        );
        console.log("Fetched participant:", participant);
      } catch (err: unknown) {
        if (err instanceof Error) {
          console.warn("Participant not found:", err.message);
        } else {
          console.warn("Participant not found:", String(err));
        }
      }

      // Handle private event
      if (isPrivate && (!participant || !participant.participantType)) {
        console.warn("RSVP blocked: not invited to private event");
        // alert("RSVP failed: You are not invited to this private event.");
        toast({
          variant: "destructive",
          title: "RSVP Failed",
          description: "You are not invited to this private event.",
        });

        setRSVPDialogOpen(false);
        return;
      }

      // If already confirmed, no action needed
      if (participant?.confirmed) {
        console.log("Already confirmed, skipping RSVP");
        setRSVPDialogOpen(false);
        return;
      }

      //Proceed with RSVP
      const updated = await rsvp({
        programId: programDetails.programId,
        accountId: user.accountId,
        visibility: programDetails.visibility?.toLowerCase() ?? "public",
      });

      setAttendee(updated);
      if (updateAttendeesList && updated?.confirmed) {
        updateAttendeesList(updated);
      }

      setRSVPDialogOpen(false);
      setRSVPConfirmationVisible(true);
      setTimeout(() => setRSVPConfirmationVisible(false), 3000);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "RSVP failed";
      console.error("RSVP failed:", message);
      toast({
        variant: "destructive",
        title: "RSVP Failed",
        description: message,
      });
      setRSVPDialogOpen(false);
    }
  };

  const handleAbsentClick = () => {
    setDropdownOpen(false); // Close the dropdown immediately
    setAbsentDialogOpen(true); // Open the alert dialog
  };

  const handleAbsentConfirmation = async () => {
    if (!user?.accountId || !programDetails?.programId) return;
    try {
      await markAbsent(programDetails.programId, user.accountId);
      await refreshAttendee();
      setAbsentDialogOpen(false);
      setNotificationVisible(true);

      // After "Mark as absent" successfull, refreshing to RSVP button
      const updatedParticipant =
        await programParticipantApi.getProgramParticipant(
          programDetails.programId,
          user?.accountId,
        );
      setAttendee(updatedParticipant);

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
              {attendee?.confirmed ? (
                <DropdownMenuItem onSelect={handleAbsentClick}>
                  <LogOut color="red" />
                  <span className="text-red"> Mark absent </span>
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem onSelect={handleRSVPClick}>
                  <LogIn color="green" />
                  <span className="text-green-500">RSVP</span>
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
      <AlertDialog
        open={isRSVPDialogOpen}
        onOpenChange={setRSVPDialogOpen}
        // onOpenChange={(open) => {
        //   setRSVPDialogOpen(open);
        //   if (!open) setRsvpErrorMessage(null);
        // }}
      >
        <AlertDialogContent className="max-w-xs sm:max-w-sm md:max-w-lg overflow-y-auto max-h-[90vh] rounded-lg">
          <AlertDialogHeader>
            <AlertDialogTitle>
              Would you like to confirm your presence?
            </AlertDialogTitle>
            <AlertDialogDescription>
              If you cannot attend the event anymore, you will have the option
              to mark yourself as absent.
            </AlertDialogDescription>
            {/* {false && rsvpErrorMessage && (
              <p className="text-red-500 mt-2 text-sm text-center">
                {rsvpErrorMessage}
              </p>
            )} */}
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setRSVPDialogOpen(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRSVPConfirmation}
              disabled={rsvpLoading}
            >
              {rsvpLoading ? "Submitting..." : "Confirm"}
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="bg-teal-700 text-white p-6 rounded-xl shadow-lg flex flex-col items-center space-y-4 max-w-sm w-full">
            <Frown className="w-12 h-12" />
            <p className="text-center">
              You have successfully postponed the event. The participants will
              be notified.
            </p>
          </div>
        </div>
      )}

      {/* Delete event confirmation message */}
      {isDeleteConfirmationVisible && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="bg-teal-700 text-white p-6 rounded-xl shadow-lg flex flex-col items-center space-y-4 max-w-sm w-full">
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="bg-teal-700 text-white p-6 rounded-xl shadow-lg flex flex-col items-center space-y-4 max-w-sm w-full">
            <Smile className="w-12 h-12" />
            <p className="text-center">
              Your presence is noted. Can&#39;t wait to see you!
            </p>
          </div>
        </div>
      )}

      {/* Notification when player confirms absence */}
      {isNotificationVisible && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="bg-teal-700 text-white p-6 rounded-xl shadow-lg flex flex-col items-center space-y-4 max-w-sm w-full">
            <Frown className="w-12 h-12" />
            <p className="text-center">Your absence is noted.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default DropDownMenuButton;
