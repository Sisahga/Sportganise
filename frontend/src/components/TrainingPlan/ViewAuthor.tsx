// Hooks
import usePersonalInformation from "@/hooks/usePersonalInfromation";
// UI Component
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
// Icons
import { User2Icon } from "lucide-react";

// Display Author Personal Details in Table Row
interface ViewAuthorProps {
  userId: number;
}

export const ViewAuthor: React.FC<ViewAuthorProps> = ({
  userId,
}: ViewAuthorProps) => {
  const { data: accountDetails } = usePersonalInformation(userId);
  return (
    <div>
      <div className="capitalize">
        {accountDetails ? (
          <div className="flex items-center">
            <Avatar className="mr-2 self-center w-5 h-5">
              <AvatarImage src={accountDetails?.pictureUrl} />
              <AvatarFallback>
                <User2Icon color="#a1a1aa" />
              </AvatarFallback>
            </Avatar>
            <p>{`${accountDetails?.firstName} ${accountDetails?.lastName}`}</p>
          </div>
        ) : (
          <span className="text-yellow-600">DNE</span>
        )}
      </div>
    </div>
  );
};
