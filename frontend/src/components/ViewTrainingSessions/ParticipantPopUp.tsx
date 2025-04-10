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
import { LoaderCircle, User2Icon } from "lucide-react";
import AttendeeBadgeType from "./BadgeTypes/AttendeeBadgeType";
import usePersonalInformation from "@/hooks/usePersonalInfromation";
import log from "loglevel";
import { useLocation, useNavigate } from "react-router";
import { CreateChannelDto } from "@/types/dmchannels";
import useCreateChannel from "@/hooks/useCreateChannel";
import useAbsent from "@/hooks/useAbsent";
import { useEffect } from "react";
import { Attendees } from "@/types/trainingSessionDetails";
import useConfirmParticipant from "@/hooks/useConfirmParticipant";
import useRejectParticipant from "@/hooks/useRejectParticipant";
import useGetCookies from "@/hooks/useGetCookies.ts";

interface ParticipantPopUpProps {
  accountAttendee: Attendees;
  isOpen: boolean;
  onClose: () => void;
  onRefresh: () => void;
}

const ParticipantPopUp: React.FC<ParticipantPopUpProps> = ({
  accountAttendee,
  isOpen,
  onClose,
  onRefresh,
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
    fetchAccountData,
  } = usePersonalInformation();
  const navigate = useNavigate();
  const { userId, preLoading } = useGetCookies(); // userId here is the currentUserId
  const { createChannel } = useCreateChannel();
  const location = useLocation();
  const recurrenceId = location.state.programDetails.recurrenceId;

  useEffect(() => {
    if (!preLoading) {
      fetchAccountData(accountId).then((_) => _);
    }
  }, [preLoading, accountId, fetchAccountData]);

  const handleSendMessage = async () => {
    const memberIds = [userId, accountId];
    const newChannelDetails: CreateChannelDto = {
      channelId: null,
      channelName: "",
      channelType: "SIMPLE",
      memberIds,
      createdAt: new Date().toISOString(),
      avatarUrl: null,
    };

    const channelResponse = await createChannel(newChannelDetails, userId);
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

  const {
    markAbsent,
    loading: absentLoading,
    error: absentError,
    data: absentData,
  } = useAbsent();

  const {
    confirmParticipant,
    confirming,
    error: confirmError,
    successData: confirmData,
  } = useConfirmParticipant();

  useEffect(() => {
    console.log("Updated absentData:", absentData);
  }, [absentData]);

  const handleAbsentClick = async () => {
    try {
      await markAbsent(recurrenceId, accountId);
      console.log("Loading... ", absentLoading);
      console.log("Marked Absent Participant: ", absentData);
      console.log("error maybe", absentError);
      if (onRefresh) onRefresh();
      onClose();
    } catch {
      console.log("recurrenceId", recurrenceId);
      console.log(
        "Error marking the user as absent in DropDownMenuButton",
        absentError,
      );
    }
  };

  const handleConfirmClick = async () => {
    try {
      await confirmParticipant(recurrenceId, accountId);
      console.log("Loading... ", confirming);
      console.log("Confirming Participant: ", confirmData);
      console.log("error", confirmError);
      if (onRefresh) onRefresh();
      onClose();
    } catch {
      console.log("recurrenceId", recurrenceId);
      console.log(
        "Error confirming the user in ParticipantPopUp",
        confirmError,
      );
    }
  };

  const { rejectParticipant } = useRejectParticipant();
  // New function to handle the opt out action.
  const handleOptOutClick = async () => {
    try {
      await rejectParticipant(recurrenceId, accountId);
      console.log("Participant opted out");
      // Add additional opt out logic here if needed.
      if (onRefresh) onRefresh();
      onClose();
    } catch (error) {
      console.error("Error opting out:", error);
    }
  };

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
          <div className="flex flex-col w-full space-y-2">
            {/* First row - Send Message button on right, Mark Absent on left if applicable */}
            <div className="flex justify-between items-center w-full">
              <div>
                {accountAttendee.confirmed && (
                  <Button onClick={handleAbsentClick} className="bg-red">
                    Mark Absent
                  </Button>
                )}
              </div>
              <Button onClick={handleSendMessage}>Send Message</Button>
            </div>

            {/* Second row - Confirm and Opt Out buttons if applicable */}
            {!accountAttendee.confirmed && accountAttendee.rank !== null && (
              <div className="flex space-x-2">
                <Button onClick={handleConfirmClick} className="bg-teal-500">
                  Confirm for the Training Session
                </Button>
                <Button onClick={handleOptOutClick} className="bg-gray-500">
                  Opt Out
                </Button>
              </div>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ParticipantPopUp;
