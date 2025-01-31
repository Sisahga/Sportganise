import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog.tsx";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog.tsx";
import { Button } from "@/components/ui/Button.tsx";
import { UserMinus, UserPlus } from "lucide-react";
import {
  ChannelMember,
  GroupChannelMemberRole,
  MembersSettingsDialogProps,
} from "@/types/dmchannels.ts";
import useRemoveChannelMember from "@/hooks/useRemoveChannelMember.ts";
import log from "loglevel";
import { SendMessageComponent } from "@/types/messaging.ts";
import useSendMessage from "@/hooks/useSendMessage.ts";
import AddMembers from "@/components/Inbox/AddMembers.tsx";
import { AccountDetailsDirectMessaging } from "@/types/account.ts";
import directMessagingApi from "@/services/api/directMessagingApi.ts";
import { getCookies } from "@/services/cookiesService.ts";

export function MembersSettingsDialog({
  isOpen,
  onClose,
  channelMembers,
  channelId,
  websocketRef,
  currentUserId,
}: MembersSettingsDialogProps) {
  const cookies = getCookies();
  const userFirstName = cookies.firstName;
  const [members, setMembers] = useState<ChannelMember[]>(channelMembers);
  const [alertDialogOpen, setAlertDialogOpen] = useState(false);
  const [addMembersIsOpen, setAddMembersIsOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<ChannelMember | null>(
    null,
  );
  const [selectedUsers, setSelectedUsers] = useState<
    AccountDetailsDirectMessaging[]
  >([]);
  const { removeChannelMember } = useRemoveChannelMember();
  const { sendDirectMessage } = useSendMessage();

  useEffect(() => {
    setMembers(channelMembers);
  }, [channelMembers]);

  const handleRemove = (member: ChannelMember) => {
    setSelectedMember(member);
    setAlertDialogOpen(true);
  };

  const handleRemoveConfirm = async () => {
    if (selectedMember) {
      setMembers(
        members.filter((m) => m.accountId !== selectedMember.accountId),
      );
      // Call API to remove member from group
      const response = await removeChannelMember(
        channelId,
        selectedMember.accountId,
      );
      if (response?.status === 200) {
        log.info(
          `Member ${selectedMember.accountId} removed from channel ${channelId}`,
        );
        const leaveMessageRemoverViewContent = `You removed ${selectedMember.firstName} ${selectedMember.lastName} from the group.`;
        const leaveMessageContent = `${userFirstName} removed ${selectedMember.firstName} ${selectedMember.lastName} from the group.`;
        const messagePayload: SendMessageComponent = {
          senderId: currentUserId,
          channelId: channelId,
          messageContent: `LEAVE*${currentUserId}*${leaveMessageRemoverViewContent}*${leaveMessageContent}`,
          attachments: [],
          sentAt: new Date().toISOString(),
          type: "LEAVE",
          senderFirstName: userFirstName,
          avatarUrl: cookies.pictureUrl,
        };
        sendDirectMessage(messagePayload, websocketRef);
        setAlertDialogOpen(false);
        setSelectedMember(null);
        onClose();
      } else {
        log.info(
          `Error removing member ${selectedMember.accountId} from channel ${channelId}`,
        );
      }
    }
  };

  const handleAddMembers = async () => {
    const memberIds = selectedUsers.map((user) => user.accountId);
    const addChannelMembersDto = {
      channelId: channelId,
      memberIds: memberIds,
      adminId: currentUserId,
    };
    const response =
      await directMessagingApi.addChannelMembers(addChannelMembersDto);
    if (response?.status === 201) {
      log.info(`${memberIds.length} new members added to channel ${channelId}`);
      let newMemberNames = "";
      let counter = 0;
      selectedUsers.forEach((user) => {
        newMemberNames +=
          counter == selectedUsers.length - 1 && selectedUsers.length > 1
            ? ` and ${user.firstName} ${user.lastName}`
            : `${user.firstName} ${user.lastName}${selectedUsers.length > 2 ? "," : ""}`;
        counter++;
      });
      const messagePayload: SendMessageComponent = {
        senderId: currentUserId,
        channelId: channelId,
        messageContent: `JOIN*${currentUserId}*You added ${newMemberNames} to the group.*Walter added ${newMemberNames} to the group.`,
        attachments: [],
        sentAt: new Date().toISOString(),
        type: "JOIN",
        senderFirstName: userFirstName,
        avatarUrl: cookies.pictureUrl,
      };
      sendDirectMessage(messagePayload, websocketRef);

      setMembers([
        ...members,
        ...selectedUsers.map((user) => {
          return {
            accountId: user.accountId,
            firstName: user.firstName,
            lastName: user.lastName,
            avatarUrl: undefined,
            role: GroupChannelMemberRole.REGULAR,
          };
        }),
      ]);

      setAddMembersIsOpen(false);
      onClose();
    } else {
      log.info(`Error adding members to channel ${channelId}`);
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent
          className="sm:max-w-[425px] bg-white text-primaryColour rounded-lg"
          style={{ maxWidth: "90vw" }}
        >
          <DialogHeader>
            <DialogTitle className="text-2xl text-primaryColour font-bold">
              Members Settings
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            {members.map((member) => (
              <div
                key={member.accountId}
                className="flex items-center justify-between py-2 text-primaryColour gap-4"
              >
                <div className="flex w-full justify-between items-center">
                  <span>
                    {member.firstName} {member.lastName}
                  </span>
                  <span className="font-light text-sm faded-primary-colour italic">
                    {member.role == GroupChannelMemberRole.ADMIN && "ADMIN"}
                  </span>
                </div>
                <div className="flex items-center">
                  {/* Do not show remove option if member is current user */}
                  {member.accountId !== currentUserId ? (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemove(member)}
                    >
                      <UserMinus className="h-4 w-4" />
                      <span className="sr-only">
                        Remove {member.firstName} {member.lastName}
                      </span>
                    </Button>
                  ) : (
                    <span className="text-sm primary-colour font-light italic">
                      (You)
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
          <Button
            className="mt-4 font-bold
            py-2 px-4"
            onClick={() => {
              setAddMembersIsOpen(true);
            }}
          >
            Add Members
            <UserPlus className="h-4 w-4 mr-2" />
          </Button>
        </DialogContent>
      </Dialog>

      <Dialog open={addMembersIsOpen} onOpenChange={setAddMembersIsOpen}>
        <DialogContent
          className="sm:max-w-[425px] bg-white text-primaryColour rounded-lg"
          style={{ maxWidth: "95vw" }}
        >
          <DialogHeader>
            <DialogTitle className="text-xl text-primaryColour font-bold">
              Select Members to Add
            </DialogTitle>
          </DialogHeader>
          <AddMembers
            selectedUsers={selectedUsers}
            setSelectedUsers={setSelectedUsers}
            submitButtonLabel={"Confirm"}
            createFunction={handleAddMembers}
            currentUserId={currentUserId}
            excludedMembers={members}
          ></AddMembers>
        </DialogContent>
      </Dialog>

      <AlertDialog open={alertDialogOpen} onOpenChange={setAlertDialogOpen}>
        <AlertDialogContent
          className="bg-white text-primaryColour rounded-lg"
          style={{ maxWidth: "85vw" }}
        >
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-bold">
              Are you sure?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This will remove {selectedMember?.firstName}{" "}
              {selectedMember?.lastName} from the group.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              className="text-primaryColour
            bg-white hover:bg-textPlaceholderColour"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRemoveConfirm}
              className="bg-secondaryColour text-primaryColour font-bold hover:bg-textPlaceholderColour"
            >
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
