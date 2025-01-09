/* eslint-disable react/prop-types */
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
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface DropDownMenuButtonProps {
  accountType: string;
}

export const DropDownMenuButton: React.FC<DropDownMenuButtonProps> = ({
  accountType,
}) => {
  const navigate = useNavigate();
  //Confirmation of player absence
  const [isNotificationVisible, setNotificationVisible] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);

  // Handle player leaving
  const handleButtonClickPlayer = () => {
    setModalVisible(true); // Show the modal on button click
  };

  // Handle waitlisted joining
  /*
  const handleButtonClickWaitlisted = () => {
    setModalVisible(true); // Show the modal on button click
  };
  */

  const handleLeave = () => {
    setModalVisible(false); // Close the modal
    setNotificationVisible(true); // Show the notification
    setTimeout(() => {
      setNotificationVisible(false); // Hide the notification after 3 seconds
    }, 3000);
  };

  const handleCancel = () => {
    setModalVisible(false); // Close the modal without proceeding
  };

  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            aria-label="Add new item"
            className="fixed bottom-20 right-5 bg-secondaryColour text-white p-4 rounded-full shadow-lg hover:bg-cyan-500 focus:outline-none flex items-center justify-center"
          >
            <EllipsisVertical />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuLabel>Options</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {accountType.toLowerCase() === "coach" ||
          accountType.toLowerCase() === "admin" ? (
            <DropdownMenuGroup>
              <DropdownMenuItem
                onClick={() => navigate("/pages/ModifyTrainingSessionPage")}
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
              <DropdownMenuItem onClick={handleButtonClickPlayer}>
                <LogOut color="red" />
                <span className="text-red">Mark as absent</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Confirmation Modal */}
      {isModalVisible && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80 text-center">
            <p className="text-lg font-semibold mb-4">Are you sure?</p>
            <div className="flex justify-around">
              <button
                onClick={handleCancel}
                className="bg-teal-500 hover:bg-teal-600 text-white font-bold py-2 px-4 rounded-full"
              >
                Cancel
              </button>
              <button
                onClick={handleLeave}
                className="bg-gray-300 hover:bg-gray-400 text-gray-700 font-bold py-2 px-4 rounded-full"
              >
                Leave
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notification */}
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
