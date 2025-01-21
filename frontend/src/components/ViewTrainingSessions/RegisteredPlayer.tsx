import { Avatar, AvatarFallback } from "../ui/avatar";
import { User2Icon } from "lucide-react";
import AttendeeBadgeType from "./AttendeeBadgeType";
import usePersonalInformation from "@/hooks/usePersonalInfromation";
import { useEffect, useState } from "react";
import { Account } from "@/types/account";

interface RegisteredPlayerProps {
  accountId: number;
}

const RegisteredPlayer: React.FC<RegisteredPlayerProps> = ({ accountId }) => {
  const { data, loading, error } = usePersonalInformation(accountId);
  const [, /*accountDetails*/ setAccountDetails] = useState<Account>();
  useEffect(() => {
    setAccountDetails(data ?? undefined);
  }, [data]);
  return (
    <div>
      <div className="flex my-2">
        <div className="mr-4 self-center">
          <Avatar>
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
              {data?.firstName} {data?.lastName}
            </h4>
          )}
          {AttendeeBadgeType(data?.type ?? "")}
        </div>
      </div>
      <hr className="h-px bg-gray-200 border-0 dark:bg-gray-700" />
    </div>
  );
};

export default RegisteredPlayer;
