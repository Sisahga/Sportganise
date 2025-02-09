// React
import { useNavigate } from "react-router";
// Hooks
import usePersonalInformation from "@/hooks/usePersonalInfromation";
// Custom Components
import AttendeeBadgeType from "@/components/ViewTrainingSessions/BadgeTypes/AttendeeBadgeType";
// UI Components
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Button } from "@/components/ui/Button";
// Icons
import { User2Icon, MessageCirclePlus } from "lucide-react";
// Log
import log from "loglevel";

// Display Author Personal Details in Table Row
interface ViewAuthorProps {
  userId: number;
}

export const ViewAuthor: React.FC<ViewAuthorProps> = ({
  userId,
}: ViewAuthorProps) => {
  log.info("Rendered ViewAuthor component");
  // Fetch Person Details
  const { data: accountDetails } = usePersonalInformation(userId);
  // Handle Navigation (to Messages page)
  const navigate = useNavigate();
  return (
    <div className="capitalize">
      {accountDetails ? (
        <HoverCard>
          <HoverCardTrigger asChild>
            <div className="flex items-center">
              <Avatar className="mr-2 self-center w-5 h-5">
                <AvatarImage src={accountDetails?.pictureUrl} />
                <AvatarFallback>
                  <User2Icon color="#a1a1aa" />
                </AvatarFallback>
              </Avatar>
              <p>{`${accountDetails?.firstName} ${accountDetails?.lastName}`}</p>
            </div>
          </HoverCardTrigger>
          <HoverCardContent className="w-60">
            <div className="flex justify-space-between space-x-4">
              <div>
                <Avatar>
                  <AvatarImage src={accountDetails?.pictureUrl} />
                  <AvatarFallback>
                    <User2Icon color="#a1a1aa" />
                  </AvatarFallback>
                </Avatar>
              </div>
              <div className="flex flex-col space-y-1 justify-self-start">
                <p className="font-semibold text-sm">{`${accountDetails?.firstName} ${accountDetails?.lastName}`}</p>
                <p className="text-sm text-gray-500">{accountDetails?.email}</p>
                <div className="flex items-center gap-1 pt-1">
                  <AttendeeBadgeType accountType={accountDetails?.type} />
                  <Button
                    variant="outline"
                    className="rounded-full w-16 h-6"
                    onClick={() => navigate("/pages/DirectMessagesDashboard")}
                  >
                    <span className="flex items-center">
                      <p className="text-gray-500 text-xs">chat</p>
                      <MessageCirclePlus
                        className="border-spacing-5 border-slate-400 ml-1"
                        size={14}
                        color="gray"
                      />
                    </span>
                  </Button>
                </div>
              </div>
            </div>
          </HoverCardContent>
        </HoverCard>
      ) : (
        <span className="text-yellow-600">DNE</span>
      )}
    </div>
  );
};
