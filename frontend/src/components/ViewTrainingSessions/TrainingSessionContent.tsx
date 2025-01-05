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
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useLocation } from "react-router-dom";

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

//function MessagesSection({ messages }: MessagesSectionProps) {

const TrainingSessionContent = () => {
  const location = useLocation();
  const programDetails = location.state.programDetails;

  return (
    <div className="mb-32">
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
        <button
          aria-label="Add new item"
          className="fixed bottom-20 right-5 bg-secondaryColour text-white p-4 rounded-full shadow-lg hover:bg-cyan-500 focus:outline-none flex items-center justify-center"
        >
          <EllipsisVertical />
        </button>

        <div>
          <ViewRegisteredPlayersContent />
        </div>
      </div>
    </div>
  );
};

export default TrainingSessionContent;
