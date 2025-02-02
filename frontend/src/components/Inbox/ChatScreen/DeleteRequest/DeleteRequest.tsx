import { useState } from "react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer.tsx";
import { Button } from "@/components/ui/Button.tsx";
import { Badge } from "@/components/ui/badge.tsx";
import { ChevronDown, CircleAlert, TriangleAlert, X } from "lucide-react";
import {
  DeleteChannelRequestMemberStatus,
  DeleteChannelRequestResponseDto,
  DeleteRequestProps,
  SetDeleteApproverStatusDto,
} from "@/types/deleteRequest.ts";
import useSetApproverDeleteStatus from "@/hooks/useSetApproverDeleteStatus.ts";
import { useNavigate } from "react-router";
import { useToast } from "@/hooks/use-toast.ts";
import log from "loglevel";
import ResponseDto from "@/types/response.ts";
import useSendMessage from "@/hooks/useSendMessage.ts";
import { SendMessageComponent } from "@/types/messaging.ts";
import { getCookies } from "@/services/cookiesService.ts";

export default function DeleteRequest({
  deleteRequestActive,
  deleteRequest,
  currentUserId,
  currentUserApproverStatus,
  setDeleteRequestActive,
  websocketRef,
  setDeleteRequest,
}: DeleteRequestProps) {
  const cookies = getCookies();
  const navigate = useNavigate();

  const { setApproverDeleteStatus } = useSetApproverDeleteStatus();
  const { toast } = useToast();
  const { sendDirectMessage } = useSendMessage();
  const handleApproveStatusChange = async (
    status: DeleteChannelRequestMemberStatus,
  ) => {
    const setApproverDeleteStatusDto: SetDeleteApproverStatusDto = {
      deleteRequestId:
        deleteRequest?.deleteChannelRequestDto.deleteRequestId || 0,
      channelId: deleteRequest?.deleteChannelRequestDto.channelId || 0,
      accountId: currentUserId,
      status: status,
    };

    const response:
      | ResponseDto<null>
      | ResponseDto<DeleteChannelRequestResponseDto> =
      await setApproverDeleteStatus(setApproverDeleteStatusDto);
    // 303 if channel was deleted because all members approved.
    if (response.statusCode === 303) {
      log.info(
        "Channel {} deleted.",
        deleteRequest?.deleteChannelRequestDto.channelId,
      );
      toast({
        title: "Channel deleted.",
        description: "The message channel is now permanently deleted.",
        variant: "success",
      });
      navigate("/pages/DirectMessagesDashboard");
    } else if (response.statusCode === 204) {
      // 204 if delete request was denied.
      log.info(
        "Channel {} request to delete denied.",
        deleteRequest?.deleteChannelRequestDto.channelId,
      );
      toast({
        title: "Channel request to delete denied.",
        description: "The channel's delete request was successfully denied.",
        variant: "success",
      });
      const denyMessage = `${currentUserId === deleteRequest?.deleteChannelRequestDto.creatorId ? "cancelled the request to delete the channel" : "denied the request to delete the channel"}`;
      const messagePayload: SendMessageComponent = {
        senderId: currentUserId,
        channelId: deleteRequest?.deleteChannelRequestDto.channelId || 0,
        messageContent: `DELETE*${currentUserId}*You ${denyMessage}*${cookies.firstName} ${denyMessage}`,
        attachments: [],
        sentAt: new Date().toISOString(),
        type: "DELETE",
        senderFirstName: cookies.firstName,
        avatarUrl: cookies.pictureUrl,
      };
      sendDirectMessage(messagePayload, websocketRef);
      setDeleteRequestActive(false);
    } else if (response.statusCode === 200) {
      // 200 if status was successfully set without altering channel state.
      log.info(
        "Account {} approved to delete the channel, waiting on other members.",
        currentUserId,
      );
      const updatedResponse = {
        deleteChannelRequestDto: deleteRequest!.deleteChannelRequestDto,
        channelMembers: deleteRequest!.channelMembers.map((member) => {
          if (member.accountId === currentUserId) {
            return {
              ...member,
              status: status,
            };
          }
          return member;
        }),
      };
      setDeleteRequest(updatedResponse);
      toast({
        title: "Successfully set status to Approved",
        description: "Waiting for full approval before deleting the channel.",
        variant: "success",
      });
    } else {
      log.error(
        "Error setting approval status for channel {}: {}",
        deleteRequest?.deleteChannelRequestDto.channelId,
        response.message,
      );
      toast({
        title: "Error: ",
        description: `${response.message}`,
        variant: "destructive",
      });
    }
    setIsDeleteRequestDrawerOpen(false);
  };

  const [isDeleteRequestDrawerOpen, setIsDeleteRequestDrawerOpen] =
    useState<boolean>(
      deleteRequestActive &&
        currentUserApproverStatus == DeleteChannelRequestMemberStatus.PENDING,
    );

  return (
    <Drawer
      open={isDeleteRequestDrawerOpen}
      onOpenChange={setIsDeleteRequestDrawerOpen}
      direction="top"
    >
      <DrawerTrigger asChild className="flex items-center justify-center">
        <div>
          <Button
            className="flex items-center justify-between w-full mx-3 bg-primary-colour"
            aria-label="Delete Request"
            style={{
              borderRadius: "0 0 1rem 1rem",
            }}
          >
            <div className="flex items-center gap-2">
              <p className="font-semibold">Delete Request</p>
              <CircleAlert
                style={{ color: "var(--primary-red)" }}
                strokeWidth={3}
              />
            </div>
            <ChevronDown className="h-4 w-4" />
          </Button>
        </div>
      </DrawerTrigger>
      <DrawerContent className="fixed top-0 left-0 right-0 min-h-64 rounded-b-[10px] translate-y-0">
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <div className="absolute top-8 left-1/2 -translate-x-1/2">
              <TriangleAlert style={{ color: "var(--primary-red)" }} />
            </div>
            <DrawerClose asChild className="absolute top-4 right-4">
              <Button
                variant="ghost"
                className="flex-1 w-10 flex items-center justify-center"
              >
                <X />
              </Button>
            </DrawerClose>
            <DrawerTitle className="text-center mt-16">
              Delete Request
            </DrawerTitle>
            <DrawerDescription
              className="text-sm text-muted-foreground text-center"
              data-testid="description" // Added data-testid
            >
              <span className="flex flex-col gap-2">
                <span>
                  <strong>
                    {deleteRequest?.deleteChannelRequestDto.creatorId ===
                    currentUserId
                      ? "You "
                      : `${deleteRequest?.deleteChannelRequestDto.creatorName} `}
                    requested to delete the channel.
                  </strong>
                </span>
                <span className="primary-red font-semibold">
                  All contents of the channel will be permanently deleted when
                  approved.
                </span>
              </span>
            </DrawerDescription>
          </DrawerHeader>
          <div className="px-4 py-2 space-y-3">
            <p className="text-sm font-semibold text-muted-foreground">
              Approval Status:
            </p>
            {[...(deleteRequest?.channelMembers || [])]
              .sort((a, b) =>
                a.accountId === currentUserId
                  ? -1
                  : b.accountId === currentUserId
                    ? 1
                    : 0,
              )
              .map((member) => (
                <div
                  key={member.accountId}
                  className="flex justify-between items-center px-2"
                >
                  <span className="text-sm">
                    {member.accountId === currentUserId ? (
                      <p className="faded-primary-colour font-bold">You</p>
                    ) : (
                      <p>
                        {member.firstName} {member.lastName}
                      </p>
                    )}
                  </span>
                  <Badge
                    id={member.accountId.toString()}
                    variant="secondary"
                    className={`${
                      member.status ===
                      DeleteChannelRequestMemberStatus.APPROVED
                        ? "bg-primaryColour text-white rounded-sm hover:bg-hover-none"
                        : "bg-textPlaceholderColour text-black rounded-sm hover:bg-hover-none"
                    }`}
                    style={{ padding: "0.25rem 0.5rem" }}
                  >
                    {member.status ===
                      DeleteChannelRequestMemberStatus.APPROVED && "Approved"}
                    {member.status ===
                      DeleteChannelRequestMemberStatus.PENDING && "Pending"}
                  </Badge>
                </div>
              ))}
          </div>
          <DrawerFooter>
            <div className="flex gap-3 justify-center w-full">
              {deleteRequest?.deleteChannelRequestDto.creatorId ===
              currentUserId ? (
                <Button
                  variant="default"
                  className="flex-1"
                  onClick={() =>
                    handleApproveStatusChange(
                      DeleteChannelRequestMemberStatus.DENIED,
                    )
                  }
                >
                  Cancel Request
                </Button>
              ) : (
                <>
                  <Button
                    variant="default"
                    className={`flex-1 ${currentUserApproverStatus === DeleteChannelRequestMemberStatus.APPROVED ? "hidden" : ""}`}
                    onClick={() =>
                      handleApproveStatusChange(
                        DeleteChannelRequestMemberStatus.APPROVED,
                      )
                    }
                  >
                    Approve
                  </Button>
                  <Button
                    variant="outline"
                    className={`flex-1 ${currentUserApproverStatus === DeleteChannelRequestMemberStatus.APPROVED ? "bg-black text-white" : ""}`}
                    onClick={() =>
                      handleApproveStatusChange(
                        DeleteChannelRequestMemberStatus.DENIED,
                      )
                    }
                  >
                    Deny
                  </Button>
                </>
              )}
            </div>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
