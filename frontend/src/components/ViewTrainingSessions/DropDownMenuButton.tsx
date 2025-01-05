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
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface DropDownMenuButtonProps {
  accountType: string;
}

export const DropDownMenuButton: React.FC<DropDownMenuButtonProps> = ({
  accountType,
}) => {
  const navigate = useNavigate();

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
              <DropdownMenuItem>
                <LogOut color="red" />
                <span className="text-red">Mark as absent</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default DropDownMenuButton;
