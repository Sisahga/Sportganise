// React
import { useEffect, useState } from "react";
// Hooks
import usePersonalInformation from "@/hooks/usePersonalInfromation";
// Services
import { getAccountIdCookie } from "@/services/cookiesService";
// UI Components
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
// Icons
import { LoaderCircle, User2Icon } from "lucide-react";
// Log
import log from "loglevel";
import AccountPopUp from "./accountPopUp";
import useGetCookies from "@/hooks/useGetCookies.ts";

// Display Author Personal Details in Table Row
interface ViewAuthorProps {
  userId: number;
}

export const ViewAuthor: React.FC<ViewAuthorProps> = ({
  userId,
}: ViewAuthorProps) => {
  log.info("Rendered ViewAuthor component");
  // Fetch Person Details
  const { data: accountDetails, fetchAccountData } = usePersonalInformation();
  // Handle Navigation (to Messages page)
  const { cookies, preLoading } = useGetCookies();
  const [currentUserId, setCurrentUserId] = useState<number>(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (!preLoading && cookies) {
      const accId = getAccountIdCookie(cookies);
      setCurrentUserId(accId);
      fetchAccountData(accId).then((_) => _);
    }
  }, [preLoading, cookies, fetchAccountData]);

  if (preLoading) {
    return (
      <div className="flex items-center">
        <LoaderCircle className="animate-spin h-6 w-6" />
      </div>
    );
  }

  return (
    <div>
      {accountDetails ? (
        <div>
          {currentUserId !== userId ? (
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
              <div className="flex items-center">
                <Avatar className="mr-2 self-center w-5 h-5">
                  <AvatarImage src={accountDetails?.pictureUrl} />
                  <AvatarFallback>
                    <User2Icon color="#a1a1aa" />
                  </AvatarFallback>
                </Avatar>
                <p>{`${accountDetails?.firstName} ${accountDetails?.lastName}`}</p>
              </div>
              <AccountPopUp
                accountId={userId}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
              />
            </div>
          ) : (
            <div className="flex items-center">
              <Avatar className="mr-2 self-center w-5 h-5">
                <AvatarImage src={accountDetails?.pictureUrl} />
                <AvatarFallback>
                  <User2Icon color="#a1a1aa" />
                </AvatarFallback>
              </Avatar>
              <p>{`${accountDetails?.firstName} ${accountDetails?.lastName}`}</p>
            </div>
          )}
        </div>
      ) : (
        <span className="text-yellow-600">N/A</span>
      )}
    </div>
  );
};
