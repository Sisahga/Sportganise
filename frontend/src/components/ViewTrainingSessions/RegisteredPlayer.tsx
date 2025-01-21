import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { User2Icon } from "lucide-react";
import AttendeeBadgeType from "./AttendeeBadgeType";
import usePersonalInformation from "@/hooks/usePersonalInfromation";
import { useEffect, useState } from "react";
import { Account } from "@/types/account";
import log from "loglevel";

interface RegisteredPlayerProps {
  accountId: number;
}

const RegisteredPlayer: React.FC<RegisteredPlayerProps> = ({ accountId }) => {
  const { data, loading, error } = usePersonalInformation(accountId);
  const [accountDetails, setAccountDetails] = useState<Account>();
  useEffect(() => {
    setAccountDetails(data ?? undefined);
    log.info(
      "RegisteredPlayer.tsx : usepersonalInformation(accountId) = ",
      data
    );
  }, [data]);
  return (
    <div>
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
            <p className="text-cyan-300 text-sm font-normal mb-1">Loading...</p>
          ) : error ? (
            <p className="text-red text-sm font-normal mb-1">
              Failed to load account details
            </p>
          ) : (
            <h4 className="text-sm font-normal mb-1">
              {accountDetails?.firstName} {accountDetails?.lastName}
            </h4>
          )}
          {AttendeeBadgeType(accountDetails?.type ?? "")}
        </div>
      </div>
      <hr className="h-px bg-gray-200 border-0 dark:bg-gray-700" />
    </div>
  );
};

export default RegisteredPlayer;
