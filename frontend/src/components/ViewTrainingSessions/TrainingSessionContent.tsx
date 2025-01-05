//This is the view of the training session page
import { ViewRegisteredPlayersContent } from "@/components/ViewRegisteredPlayers";

// Components imports
import {
  Calendar,
  Clock,
  MapPin,
  CircleUserRound,
  FileText,
  EllipsisVertical,
  MoveLeft,
  Pencil,
  Trash2,
  UsersRound,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useLocation, useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/Button";
// Data structure for data received from API call

interface Attendees {
  accountId: number;
  participantType: "COACH" | "ADMIN" | "PLAYER";
  email: string;
  address: string;
  phone: string;
  firstName: string;
  lastName: string;
}

interface ProgramDetails {
  programId: number;
  title: string;
  type: string;
  description: string;
  capacity: number;
  occurenceDate: Date;
  duration: number;
  recurring: boolean;
  expiryDate: Date;
  coach: string;
  location: string;
  attachment: File[] | null;
}

interface Event {
  programId: number;
  programDetails: ProgramDetails;
  attendees: Attendees[];
}

const TrainingSessionContent = () => {
  // Location state data sent from Calendar page card
  const location = useLocation();
  const programDetails = location.state.programDetails;

  // Navigate back to Calendar page
  const navigate = useNavigate();

  return (
    <div className="mb-32">
      <Button
        className="rounded-full mb-3"
        variant="outline"
        onClick={() => navigate("/pages/CalendarPage")}
      >
        <MoveLeft />
      </Button>
      <div className="flex items-center gap-3 my-2">
        <Avatar>
          <AvatarFallback>A</AvatarFallback>
        </Avatar>
        <h2 className="text-xl font-semibold text-secondaryColour">
          {programDetails.title}
        </h2>
      </div>

      <div>
        <div className="flex items-center gap-2">
          <Calendar
            size={15}
            color="rgb(107 114 128 / var(--tw-text-opacity, 1))"
          />
          <p className="text-sm text-gray-500">
            {programDetails.occurenceDate.toDateString()}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Clock
            size={15}
            color="rgb(107 114 128 / var(--tw-text-opacity, 1))"
          />
          <p className="text-sm text-gray-500">{programDetails.duration}</p>
        </div>
        <div className="flex items-center gap-2">
          <CircleUserRound
            size={15}
            color="rgb(107 114 128 / var(--tw-text-opacity, 1))"
          />
          <p className="text-sm text-gray-500">{programDetails.coach}</p>
        </div>
        <div className="flex items-center gap-2">
          <MapPin
            size={15}
            color="rgb(107 114 128 / var(--tw-text-opacity, 1))"
          />
          <p className="text-sm text-gray-500">{programDetails.location}</p>
        </div>
        <div className="my-7">
          <h2 className="text-l font-semibold my-2">Information</h2>
          <p className="text-sm my-2 text-gray-500">
            {programDetails.description}
          </p>
          <div
            className="flex gap-3 items-center
          "
          >
            <FileText
              size={15}
              color="rgb(107 114 128 / var(--tw-text-opacity, 1))"
            />
            <p className="text-sm text-gray-500">FILE</p>
          </div>
        </div>

        {/*Dropdown menu for coach
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
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <Pencil />
                <span>Edit Event</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <UsersRound />
                <span>Member List</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Trash2 />
                <span className="text-red">Delete Event</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
*/}
        <button
          id="dropdownMenuIconButton"
          data-dropdown-toggle="dropdownDots"
          className="inline-flex items-center p-2 text-sm font-medium text-center text-gray-900 bg-white rounded-lg hover:bg-gray-100 focus:ring-4 focus:outline-none dark:text-white focus:ring-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
          type="button"
        >
          <svg
            className="w-5 h-5"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 4 15"
          >
            <path d="M3.5 1.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm0 6.041a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm0 5.959a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z" />
          </svg>
        </button>
        <div
          id="dropdownDots"
          className="z-10 hidden bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 dark:divide-gray-600"
        >
          <ul
            className="py-2 text-sm text-gray-700 dark:text-gray-200"
            aria-labelledby="dropdownMenuIconButton"
          >
            <li>
              <a
                href="#"
                className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
              >
                Dashboard
              </a>
            </li>
            <li>
              <a
                href="#"
                className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
              >
                Settings
              </a>
            </li>
            <li>
              <a
                href="#"
                className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
              >
                Earnings
              </a>
            </li>
          </ul>
          <div className="py-2">
            <a
              href="#"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
            >
              Separated link
            </a>
          </div>
        </div>
        <div>
          <ViewRegisteredPlayersContent />
        </div>
      </div>
      <button
        aria-label="Add new item"
        className="fixed bottom-20 right-5 bg-secondaryColour text-white p-4 rounded-full shadow-lg hover:bg-cyan-500 focus:outline-none flex items-center justify-center"
      >
        <EllipsisVertical />
      </button>
    </div>
  );
};

export default TrainingSessionContent;
