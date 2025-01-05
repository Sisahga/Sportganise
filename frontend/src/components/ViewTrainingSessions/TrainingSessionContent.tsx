import { useState } from "react";

// Created components imports
import ViewRegisteredPlayersContent from "./ViewRegisteredPlayersContent";
import DropDownMenuButton from "./DropDownMenuButton";

// Components imports
import {
  Calendar,
  Clock,
  MapPin,
  CircleUserRound,
  FileText,
  MoveLeft,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useLocation, useNavigate } from "react-router-dom";
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
  // Handle account type. Only coach or admin can view list of attendees.
  const [accountType, setAccountType] = useState<string>("COACH");

  return (
    <div className="mb-32">
      {/**Return to previous page */}
      <Button
        className="rounded-full mb-3"
        variant="outline"
        onClick={() => navigate("/pages/CalendarPage")}
      >
        <MoveLeft />
      </Button>

      {/**Event title */}
      <div className="flex items-center gap-3 my-2">
        <Avatar>
          <AvatarFallback>A</AvatarFallback>
        </Avatar>
        <h2 className="text-xl font-semibold text-secondaryColour">
          {programDetails.title}
        </h2>
      </div>

      {/**Session details */}
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

        {/**Information */}
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

        {/**Conditionally render subscribed players only to Admin or Coach */}
        {(accountType.toLowerCase() === "coach" ||
          accountType.toLowerCase() === "admin") && (
          <div>
            <ViewRegisteredPlayersContent />
          </div>
        )}

        {/**Conditionally render different menu options based on account type */}
        <DropDownMenuButton accountType={accountType} />
      </div>
    </div>
  );
};

export default TrainingSessionContent;
