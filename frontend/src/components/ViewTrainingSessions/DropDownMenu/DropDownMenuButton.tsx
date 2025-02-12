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
  UsersRound,
  LogOut,
  UserRound,
  MessageCircle,
  Frown,
  Smile,
  LogIn,
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

interface DropDownMenuButtonProps {
  accountType: string | null | undefined;
  programDetails: ProgramDetails;
  attendees: Attendees[];
}

export const DropDownMenuButton: React.FC<DropDownMenuButtonProps> = ({
  accountType,
  programDetails,
  attendees,
}: DropDownMenuButtonProps) => {
  const navigate = useNavigate();
  const handleNavigation = (path: string, data: Program) => {
    navigate(path, { state: data });
  };
  log.info("DropDownMenuButton programDetails: ", programDetails);
  log.debug("Rendering DropDownMenuButton for TrainingSessionContent");

  //Confirmation of player absence
  const [isNotificationVisible, setNotificationVisible] = useState(false);
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [isRSVPDialogOpen, setRSVPDialogOpen] = useState(false);
  const [isRSVPConfirmationVisible, setRSVPConfirmationVisible] =
    useState(false);
  const [isAbsentDialogOpen, setAbsentDialogOpen] = useState(false);

  // Handle waitlisted joining
  /*
  const handleButtonClickWaitlisted = () => {
    setModalVisible(true); // Show the modal on button click
  };
  */

  const handleRSVPClick = () => {
    setDropdownOpen(false); // Close the dropdown immediately
    setRSVPDialogOpen(true); // Open the alert dialog
  };

  const handleRSVPConfirmation = () => {
    setRSVPDialogOpen(false);
    setRSVPConfirmationVisible(true); // Show RSVP confirmation message

    setTimeout(() => {
      setRSVPConfirmationVisible(false);
    }, 3000);
  };

  const handleAbsentClick = () => {
    setDropdownOpen(false); // Close the dropdown immediately
    setAbsentDialogOpen(true); // Open the alert dialog
  };

  const handleAbsentConfirmation = () => {
    setAbsentDialogOpen(false);
    setNotificationVisible(true);
    setTimeout(() => {
      setNotificationVisible(false);
    }, 3000);
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
          {accountType?.toLowerCase() === "coach" ||
          accountType?.toLowerCase() === "admin" ? (
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
              <DropdownMenuItem>
                <UsersRound />
                <span>Message all Members</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Trash2 color="red" />
                <span className="text-red">Delete Event</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          ) : (
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <MessageCircle />
                <span>Message Host</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <UserRound />
                <span>Contact Member</span>
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={handleRSVPClick}>
                <LogIn color="green" />
                <span className="text-green-500">RSVP</span>
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={handleAbsentClick}>
                <LogOut color="red" />
                <span className="text-red">Mark as absent</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Pop up when player RSVP's to event */}
      <AlertDialog open={isRSVPDialogOpen} onOpenChange={setRSVPDialogOpen}>
        <AlertDialogContent>
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
            <AlertDialogAction onClick={handleRSVPConfirmation} className="">
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Pop up when player wants to leave an event */}
      <AlertDialog open={isAbsentDialogOpen} onOpenChange={setAbsentDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure you want to mark yourself as absent?
            </AlertDialogTitle>
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

      {/* RSVP confirmation message */}
      {isRSVPConfirmationVisible && (
        <div className="fixed inset-0 flex items-center justify-center">
          <div className="bg-teal-500 text-white p-4 rounded-lg flex flex-col items-center space-y-2">
            <Smile className="w-12 h-12" />
            <p>Your presence is noted. Can&#39;t wait to see you!!!</p>
          </div>
        </div>
      )}

      {/* Notification when player confirms absence */}
      {isNotificationVisible && (
        <div className="fixed inset-0 flex items-center justify-center">
          <div className="bg-teal-500 text-white p-4 rounded-lg shadow-lg flex flex-col items-center space-y-2">
            <Frown className="w-12 h-12" />
            <p>Your absence is noted</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default DropDownMenuButton;
