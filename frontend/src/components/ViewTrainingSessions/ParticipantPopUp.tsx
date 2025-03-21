/* eslint-disable react/prop-types */
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/Button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { User2Icon } from "lucide-react";
import AttendeeBadgeType from "./BadgeTypes/AttendeeBadgeType";
import usePersonalInformation from "@/hooks/usePersonalInfromation";
import log from "loglevel";
import { useLocation, useNavigate } from "react-router";
import { CreateChannelDto } from "@/types/dmchannels";
import { getAccountIdCookie, getCookies } from "@/services/cookiesService";
import useCreateChannel from "@/hooks/useCreateChannel";
import useAbsent from "@/hooks/useAbsent";
import { useEffect } from "react";
import { Attendees } from "@/types/trainingSessionDetails";
import useConfirmParticipant from "@/hooks/useConfirmParticipant";

interface ParticipantPopUpProps {
  accountAttendee: Attendees;
  isOpen: boolean;
  onClose: () => void;
  onAbsentMarked?: () => void;
}

const ParticipantPopUp: React.FC<ParticipantPopUpProps> = ({
  accountAttendee,
  isOpen,
  onClose,
  onAbsentMarked,
}) => {
  log.debug(
    "ParticipantPopUp component initialized with accountId:",
    accountAttendee.accountId,
  );
  const accountId = accountAttendee.accountId;
  const {
    data: accountDetails,
    loading,
    error,
  } = usePersonalInformation(accountId);
  const navigate = useNavigate();
  const cookies = getCookies();
  const currentUserId = getAccountIdCookie(cookies);
  const { createChannel } = useCreateChannel();
  const location = useLocation();

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
            read: channelResponse.statusCode === 201 ? false : true,
          },
        });
      }
    } else {
      log.error("Failed to create channel:", channelResponse);
    }
  };
  log.debug("Rendering ParticipantPopUp");

  const {
    markAbsent,
    loading: absentLoading,
    error: absentError,
    data: absentData,
  } = useAbsent();

  const {confirmParticipant, confirming, error: confirmError, successData: confirmData} = useConfirmParticipant();

  useEffect(() => {
    console.log("Updated absentData:", absentData);
  }, [absentData]);

  const handleAbsentClick = async () => {
    try {
      await markAbsent(location.state.programDetails.programId, accountId);
      console.log("Loading... ", absentLoading);
      console.log("Marked Absent Participant: ", absentData);
      console.log("error maybe", absentError);
      if (onAbsentMarked) onAbsentMarked();
      onClose();
    } catch {
      console.log("programID", location.state.programDetails.programId);
      console.log(
        "Error marking the user as absent in DropDownMenuButton",
        absentError,
      );
    }
  };

  const handleConfirmClick = async () => {
    try {
      await confirmParticipant(location.state.programDetails.programId, accountId);
      console.log("Loading... ", confirming);
      console.log("Confirming Participant: ", confirmData);
      console.log("error", confirmError);
      if (onRefresh) onRefresh();
      onClose();
    } catch {
      console.log("programID", location.state.programDetails.programId);
      console.log(
        "Error confirming the user in ParticipantPopUp",
        confirmError,
      );
    }
  };

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
        {accountAttendee.confirmed ? (
          <Button onClick={handleAbsentClick} className="bg-red">
            {" "}
            Mark Absent{" "}
          </Button>
        ): accountAttendee.rank !== null ?
        (<Button onClick={handleConfirmClick} className="bg-teal-500">
          {" "}
          Confirm for the Training Session{" "}
        </Button>): null}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ParticipantPopUp;
