import { useState } from "react";

//Component imports
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, MapPin, ChevronRight } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

// TODO: Function to handle badge color of event type

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

const TrainingSessionCard: React.FC<Event> = ({ programDetails }) => {
  //const [progamDetails, setProgramDetails] = useState<ProgramDetails>();
  //setProgramDetails(programDetails);

  return (
    <Card>
      <div className="flex flex-col items-start gap-2 whitespace-nowrap border-b p-4 text-sm leading-tight last:border-b-0 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
        <div className="flex w-full items-center gap-2">
          <Avatar>
            <AvatarFallback>A</AvatarFallback>
          </Avatar>
          <span>{programDetails.coach}</span>{" "}
          <span className="ml-auto text-xs">
            {programDetails.occurenceDate.toDateString()}
          </span>
        </div>
        <span className="font-semibold">{programDetails.title}</span>
        <div>
          <span className="flex items-center">
            <Clock
              size={15}
              color="rgb(107 114 128 / var(--tw-text-opacity, 1))"
              className="mb-1 mr-1"
            />
            <p className="text-gray-500 whitespace-break-spaces text-xs">
              {programDetails.duration}
            </p>
          </span>
          <span className="flex items-center">
            <MapPin
              size={15}
              color="rgb(107 114 128 / var(--tw-text-opacity, 1))"
              className="mr-1"
            />
            <p className="text-gray-500 whitespace-break-spaces text-xs">
              {programDetails.location}
            </p>
          </span>
        </div>
        <span className="line-clamp-2 w-[260px] whitespace-break-spaces text-xs">
          {programDetails.description}
        </span>
        <div className="flex">
          <Badge>{programDetails.type}</Badge>

          {/*Click to view details */}
          <div className="ml-2 flex items-center">
            <ChevronRight size={17} color="#82DBD8" />
            <p className="font-medium text-secondaryColour">View details</p>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default TrainingSessionCard;
