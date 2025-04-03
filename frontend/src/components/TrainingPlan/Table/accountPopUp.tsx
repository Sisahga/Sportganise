/* eslint-disable react/prop-types */
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/Button";
import { LoaderCircle, User2Icon } from "lucide-react";
import usePersonalInformation from "@/hooks/usePersonalInfromation";
import log from "loglevel";
import { useNavigate } from "react-router";
import { CreateChannelDto } from "@/types/dmchannels";
import { getAccountIdCookie } from "@/services/cookiesService";
import useCreateChannel from "@/hooks/useCreateChannel";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import AttendeeBadgeType from "@/components/ViewTrainingSessions/BadgeTypes/AttendeeBadgeType";
import useGetCookies from "@/hooks/useGetCookies.ts";
import { useEffect, useState } from "react";

interface AccountPopUpProps {
  accountId: number;
  isOpen: boolean;
  onClose: () => void;
}

const AccountPopUp: React.FC<AccountPopUpProps> = ({
  accountId,
  isOpen,
  onClose,
}) => {
  log.debug(
    "ParticipantPopUp component initialized with accountId:",
    accountId,
  );
  const {
    data: accountDetails,
    loading,
    error,
    fetchAccountData,
  } = usePersonalInformation();
  const navigate = useNavigate();
  const { cookies, preLoading } = useGetCookies();
  const { createChannel } = useCreateChannel();
  const [currentUserId, setCurrentUserId] = useState<number>(0);

  useEffect(() => {
    if (!preLoading && cookies) {
      const accId = getAccountIdCookie(cookies);
      setCurrentUserId(accId);
      fetchAccountData(accId).then((_) => _);
    }
  }, [preLoading, cookies]);

  const handleSendMessage = async () => {
    const memberIds = [currentUserId, accountId];
    const newChannelDetails: CreateChannelDto = {
      channelId: null,
      channelName: "",
      channelType: "SIMPLE",
      memberIds,
      createdAt: new Date().toISOString(),
      avatarUrl: null,
    };

    const channelResponse = await createChannel(
      newChannelDetails,
      currentUserId,
    );
    if (
      channelResponse?.statusCode === 201 ||
      channelResponse?.statusCode === 302
    ) {
      if (channelResponse.data) {
        navigate("/pages/DirectMessageChannelPage", {
          state: {
            channelId: channelResponse.data.channelId,
            channelName: channelResponse.data.channelName,
            channelType: channelResponse.data.channelType,
            channelImageBlob: channelResponse.data.avatarUrl,
            read: channelResponse.statusCode !== 201,
          },
        });
      }
    } else {
      log.error("Failed to create channel:", channelResponse);
    }
  };
  log.debug("Rendering ParticipantPopUp");

  if (preLoading) {
    return (
      <div>
        <LoaderCircle className="animate-spin h-6 w-6" />
      </div>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-auto p-6 rounded-lg">
        <DialogHeader>
          <DialogTitle>Player Information</DialogTitle>
        </DialogHeader>
        <div className="flex items-center gap-4">
          <Avatar className="w-16 h-16">
            <AvatarImage src={accountDetails?.pictureUrl} />
            <AvatarFallback>
              <User2Icon color="#a1a1aa" />
            </AvatarFallback>
          </Avatar>
          <div>
            {loading ? (
              <p className="text-cyan-300 text-sm font-normal">Loading...</p>
            ) : error ? (
              <p className="text-red-500 text-sm font-normal">
                Failed to load account details
              </p>
            ) : (
              <>
                <h4 className="text-lg font-semibold">
                  {accountDetails?.firstName} {accountDetails?.lastName}
                </h4>
                <p className="text-sm text-gray-500">{accountDetails?.email}</p>
                <p className="text-sm text-gray-500">{accountDetails?.phone}</p>
                <AttendeeBadgeType accountType={accountDetails?.type} />
              </>
            )}
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSendMessage}> Send Message </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AccountPopUp;
