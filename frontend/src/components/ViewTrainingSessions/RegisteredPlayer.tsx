import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { User2Icon } from "lucide-react";
import AttendeeBadgeType from "./BadgeTypes/AttendeeBadgeType";
import usePersonalInformation from "@/hooks/usePersonalInfromation";
import ParticipantPopUp from "./ParticipantPopUp";
import log from "loglevel";

interface RegisteredPlayerProps {
  accountId: number;
}

const RegisteredPlayer: React.FC<RegisteredPlayerProps> = ({
  accountId,
}: RegisteredPlayerProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    data: accountDetails,
    loading,
    error,
  } = usePersonalInformation(accountId);
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
          </div>
        </div>
        <hr className="h-px bg-gray-200 border-0 dark:bg-gray-700" />
      </div>
      <ParticipantPopUp
        accountId={accountId}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default RegisteredPlayer;
