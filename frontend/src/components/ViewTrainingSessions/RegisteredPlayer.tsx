import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { User2Icon } from "lucide-react";
import AttendeeBadgeType from "./BadgeTypes/AttendeeBadgeType";
import usePersonalInformation from "@/hooks/usePersonalInfromation";
import ParticipantPopUp from "./ParticipantPopUp";
import log from "loglevel";
import { Badge } from "../ui/badge";
import { Attendees } from "@/types/trainingSessionDetails";

interface RegisteredPlayerProps {
  accountAttendee: Attendees;
}

const RegisteredPlayer: React.FC<RegisteredPlayerProps> = ({
  accountAttendee,
}: RegisteredPlayerProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  console.log(accountAttendee.confirmed);
  const [isConfirmed, setIsConfirmed] = useState(accountAttendee.confirmed);

  console.log("The account is ", accountAttendee);
  console.log(
    "Confirmation, accountID ",
    isConfirmed,
    accountAttendee?.accountId,
  );

  const {
    data: accountDetails,
    loading,
    error,
  } = usePersonalInformation(accountAttendee?.accountId);
  log.debug("Rendering RegisteredPlayer");

  return (
    <div>
      <div
        onClick={() => setIsModalOpen(true)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            setIsModalOpen(true);
          }
        }}
        role="button"
        tabIndex={0}
        className="cursor-pointer"
      >
        <div className="flex my-2">
          <div className="mr-4 self-center">
            <Avatar>
              <AvatarImage src={accountDetails?.pictureUrl} />
              <AvatarFallback>
                <User2Icon color="#a1a1aa" />
              </AvatarFallback>
            </Avatar>
          </div>
          <div>
            {loading ? (
              <p className="text-cyan-300 text-sm font-normal mb-1">
                Loading...
              </p>
            ) : error ? (
              <p className="text-red text-sm font-normal mb-1">
                Failed to load account details
              </p>
            ) : (
              <h4 className="text-sm font-normal mb-1">
                {accountDetails?.firstName} {accountDetails?.lastName}
              </h4>
            )}
            <AttendeeBadgeType accountType={accountDetails?.type} />
            {!isConfirmed && <Badge variant="destructive">{"absent"}</Badge>}
            {!isConfirmed && accountAttendee.rank === null && <Badge variant="destructive">{"absent"}</Badge>}
          </div>
        </div>
        <hr className="h-px bg-gray-200 border-0 dark:bg-gray-700" />
      </div>
      <ParticipantPopUp
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAbsentMarked={() => setIsConfirmed(false)}
      />
    </div>
  );
};

export default RegisteredPlayer;
