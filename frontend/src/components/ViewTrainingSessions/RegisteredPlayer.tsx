import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { User2Icon } from "lucide-react";
import AttendeeBadgeType from "./BadgeTypes/AttendeeBadgeType";
import ParticipantPopUp from "./ParticipantPopUp";
import { Badge } from "../ui/badge";
import { DetailedProgramParticipantDto } from "@/types/trainingSessionDetails";

interface RegisteredPlayerProps {
  participant: DetailedProgramParticipantDto;
  onRefresh: () => void;
}

const RegisteredPlayer: React.FC<RegisteredPlayerProps> = ({
  participant,
  onRefresh,
}: RegisteredPlayerProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div
        onClick={() => setIsModalOpen(true)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            setIsModalOpen(true);
          }
        }}
        role="button"
        tabIndex={0}
        className="cursor-pointer bg-white rounded-lg shadow p-4 hover:opacity-50 transition-opacity"
      >
        <div className="flex gap-4">
          {participant.rank && (
            <div className="mr-2 self-center flex items-center justify-center">
              <Badge className="bg-secondaryColour text-white text-xs font-semibold">
                {participant.rank}
              </Badge>
            </div>
          )}
          <div>
            <Avatar className="h-14 w-14">
              <AvatarImage src={participant.profilePicture} />
              <AvatarFallback>
                <User2Icon color="#a1a1aa" />
              </AvatarFallback>
            </Avatar>
          </div>
          <div className="flex-grow flex flex-col gap-2">
            <h4 className="text-sm font-normal">
              {participant.firstName} {participant.lastName}
            </h4>
            <div className="flex flex-col text-xs text-gray-500 font-light">
              <span>{participant.email}</span>
              <span>{participant.phone}</span>
            </div>
            <div className="flex gap-1">
              <AttendeeBadgeType accountType={participant.accountType} />
              {!participant.confirmed &&
                participant.rank === null &&
                participant.participantType !== "Coach" &&
                participant.participantType !== "Waitlisted" && (
                  <Badge variant="destructive">{"absent"}</Badge>
                )}
            </div>
          </div>
        </div>
      </div>
      <ParticipantPopUp
        accountAttendee={participant}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onRefresh={onRefresh}
      />
    </>
  );
};

export default RegisteredPlayer;
