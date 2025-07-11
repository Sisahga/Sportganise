import { useNavigate } from "react-router";
import log from "loglevel";

// Component imports
import { Card } from "@/components/ui/card";
import { Clock, MapPin, ChevronRight } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Hourglass, User2Icon } from "lucide-react";
import EventBadgeType from "./BadgeTypes/EventBadgeType";

// Data structure for data received from API call
import {
  Attendees,
  Program,
  ProgramDetails,
} from "@/types/trainingSessionDetails";

// Helper function imports
import { calculateEndTime } from "@/utils/calculateEndTime";
import { ONCE } from "@/constants/programconstants";
import ParticipantStatusBadgeType from "./BadgeTypes/ParticipantStatusBadgeType";
import useGetParticipant from "@/hooks/useGetParticipant";
import useGetCookies from "@/hooks/useGetCookies.ts";
import React, { useEffect } from "react";

interface TrainingSessionCardProps {
  programDetails: ProgramDetails;
  attendees: Attendees[];
}

const TrainingSessionCard: React.FC<Program> = ({
  programDetails,
  attendees,
}: TrainingSessionCardProps) => {
  // Handle navigation to training session detail page
  const navigate = useNavigate();
  const handleNavigation = (path: string, data: Program) => {
    navigate(path, { state: data });
  };
  log.debug("Rendering training session card.");

  const { userId, preLoading } = useGetCookies();

  const { data: userAttendee, fetchParticipant } = useGetParticipant(
    programDetails.programId, // assuming programDetails contains the program ID as 'id'
    userId,
  );

  useEffect(() => {
    if (!preLoading && userId) {
      fetchParticipant().then((_) => _);
    }
  }, [preLoading, userId]);

  return (
    <Card>
      <div className="flex flex-col items-start gap-2 whitespace-nowrap border-b p-4 text-sm leading-tight last:border-b-0 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
        <div className="flex w-full items-center gap-2">
          <Avatar>
            <AvatarFallback className="bg-primaryColour">
              <User2Icon color="#a1a1aa" />
            </AvatarFallback>
            <AvatarImage src="/src/assets/Logo.png" alt="organisation" />
          </Avatar>
          <span>{programDetails?.author ?? "N/A"}</span>{" "}
          <span className="ml-auto text-xs">
            {programDetails?.reccurenceDate &&
            programDetails?.frequency !== ONCE
              ? new Date(programDetails.reccurenceDate).toDateString()
              : (new Date(programDetails.occurrenceDate).toDateString() ??
                "N/A")}
          </span>
        </div>
        <span className="font-semibold">{programDetails?.title ?? "N/A"}</span>
        <div>
          <span className="flex items-center">
            <Clock
              size={15}
              color="rgb(107 114 128 / var(--tw-text-opacity, 1))"
              className="mb-1 mr-1"
            />
            <span className="flex items-center">
              <p className="text-gray-500 whitespace-break-spaces text-xs">
                {programDetails?.occurrenceDate
                  ? new Date(programDetails.occurrenceDate).toLocaleTimeString(
                      "en-CA",
                      { timeZone: "UTC", hour: "2-digit", minute: "2-digit" },
                    )
                  : "N/A"}
              </p>
              <hr className="mx-1 w-1 h-px border-0 bg-gray-500 " />
              <p className="text-gray-500 whitespace-break-spaces text-xs">
                {programDetails?.occurrenceDate && programDetails?.durationMins
                  ? calculateEndTime(
                      new Date(programDetails.occurrenceDate),
                      programDetails.durationMins,
                    )
                  : "N/A"}
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
                {programDetails?.durationMins ?? "N/A"} min
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
              {programDetails?.location ?? "N/A"}
            </p>
          </span>
        </div>
        <span className="line-clamp-2 w-[260px] whitespace-break-spaces text-xs">
          {programDetails?.description}
        </span>
        <div className="flex items-center space-x-1">
          {programDetails?.programType && (
            <EventBadgeType programType={programDetails.programType} />
          )}
          {userAttendee &&
            (userAttendee?.rank !== null ||
              (userAttendee?.confirmed === false &&
                userAttendee?.participantType === "Subscribed")) && (
              <ParticipantStatusBadgeType attendees={userAttendee} />
            )}

          {/* Click to view details */}
          <button
            onClick={() =>
              handleNavigation("/pages/ViewTrainingSessionPage", {
                programDetails,
                attendees,
              })
            }
            className="flex items-center bg-transparent"
          >
            <ChevronRight size={17} color="#82DBD8" />
            <p className="font-medium text-secondaryColour">View details</p>
          </button>
        </div>
      </div>
    </Card>
  );
};

export default TrainingSessionCard;
