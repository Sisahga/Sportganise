/* eslint-disable react/prop-types */
import { Card } from "@/components/ui/card";
import { Clock, MapPin, ChevronRight } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User2Icon, Hourglass } from "lucide-react";
import EventBadgeType from "@/components/ViewTrainingSessions/BadgeTypes/EventBadgeType";
import { ProgramDetails } from "@/types/trainingSessionDetails";
import { calculateEndTime } from "@/utils/calculateEndTime";
import { getCookies } from "@/services/cookiesService";
import useGetParticipant from "@/hooks/useGetParticipant";
import ParticipantStatusBadgeType from "../ViewTrainingSessions/BadgeTypes/ParticipantStatusBadgeType";

interface WaitlistedTrainingSessionCardProps {
  programDetails: ProgramDetails;
  onSelectTraining: (program: ProgramDetails) => void;
}

const WaitlistedTrainingSessionCard: React.FC<
  WaitlistedTrainingSessionCardProps
> = ({ programDetails, onSelectTraining }) => {
  if (!programDetails) {
    return null; // Prevent rendering if programDetails is missing
  }

  const accountId = getCookies().accountId;

  const { data: userAttendee } = useGetParticipant(
    programDetails.programId, // assuming programDetails contains the program ID as 'id'
    accountId
  );
  return (
    <Card
      onClick={() => onSelectTraining(programDetails)}
      className="cursor-pointer"
    >
      <div className="flex flex-col items-start gap-2 whitespace-nowrap border-b p-4 text-sm leading-tight last:border-b-0 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
        <div className="flex w-full items-center gap-2">
          <Avatar>
            <AvatarFallback className="bg-primaryColour">
              <User2Icon color="#a1a1aa" />
            </AvatarFallback>
            <AvatarImage src="/src/assets/Logo.png" alt="organisation" />
          </Avatar>
          <span>{programDetails?.author ?? "N/A"}</span>
          <span className="ml-auto text-xs">
            {new Date(programDetails.occurrenceDate).toDateString()}
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
            <span className="flex items-center">
              <p className="text-gray-500 whitespace-break-spaces text-xs">
                {new Date(programDetails.occurrenceDate).toLocaleTimeString(
                  "en-CA",
                  { timeZone: "UTC", hour: "2-digit", minute: "2-digit" },
                )}
              </p>
              <hr className="mx-1 w-1 h-px border-0 bg-gray-500" />
              <p className="text-gray-500 whitespace-break-spaces text-xs">
                {calculateEndTime(
                  new Date(programDetails.occurrenceDate),
                  programDetails.durationMins,
                )}
              </p>
            </span>
          </span>
          <span className="flex items-center">
            <Hourglass
              size={15}
              color="rgb(107 114 128 / var(--tw-text-opacity, 1))"
              className="mb-1 mr-1"
            />
            <span className="flex items-center">
              <p className="text-gray-500 whitespace-break-spaces text-xs">
                {programDetails.durationMins} min
              </p>
            </span>
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
        <div className="flex items-center space-x-1">
          <EventBadgeType programType={programDetails.programType} />
          {userAttendee && (userAttendee?.rank !== null ||
              (userAttendee?.confirmed === false &&
                userAttendee?.participantType === "Subscribed")) && (
              <ParticipantStatusBadgeType attendees={userAttendee} />
            )}

          {/* View Details Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelectTraining(programDetails);
            }}
            className="ml-2 flex items-center bg-transparent"
          >
            <ChevronRight size={17} color="#82DBD8" />
            <p className="font-medium text-secondaryColour">View details</p>
          </button>
        </div>
      </div>
    </Card>
  );
};

export default WaitlistedTrainingSessionCard;
