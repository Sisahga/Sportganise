import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu.tsx";
import { Button } from "@/components/ui/Button.tsx";
import {
  Ban,
  Edit,
  Image,
  LogOutIcon,
  MoreHorizontal,
  Trash2,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";
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
import {
  ChannelSettingsDropdownProps,
  GroupChannelMemberRole,
} from "@/types/dmchannels.ts";
import useBlockUser from "@/hooks/useBlockUser.ts";
import { BlockUserRequestDto } from "@/types/blocklist.ts";
import useChannelMembers from "@/hooks/useChannelMembers.ts";
import useSendMessage from "@/hooks/useSendMessage.ts";
import { SendMessageComponent } from "@/types/messaging.ts";
import log from "loglevel";
import { MembersSettingsDialog } from "@/components/Inbox/ChatScreen/Settings/MembersSettings.tsx";
import { RenameGroupDialog } from "@/components/Inbox/ChatScreen/Settings/RenameGroupChat.tsx";
import { ChangePictureDialog } from "@/components/Inbox/ChatScreen/Settings/ChangeGroupPicture.tsx";
import { LeaveGroupDialog } from "@/components/Inbox/ChatScreen/Settings/LeaveGroup.tsx";
import useRemoveChannelMember from "@/hooks/useRemoveChannelMember.ts";
import { useNavigate } from "react-router";

const ChannelSettingsDropdown = ({
  channelType,
  channelId,
  webSocketRef,
  isBlocked,
  currentUserId,
  channelName,
  setCurrentChannelName,
  currentChannelPictureUrl,
  setCurrentChannelPictureUrl,
}: ChannelSettingsDropdownProps) => {
  // States.
  const [isBlockOpen, setIsBlockOpen] = useState(false);
  const [userBlocked, setUserBlocked] = useState(isBlocked);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isMembersSettingsOpen, setIsMembersSettingsOpen] = useState(false);
  const [isRenameGroupOpen, setIsRenameGroupOpen] = useState(false);
  const [isChangePictureOpen, setIsChangePictureOpen] = useState(false);
  const [isLeaveGroupOpen, setIsLeaveGroupOpen] = useState(false);
  const [currentMemberRole, setCurrentMemberRole] =
    useState<GroupChannelMemberRole | null>(null);

  // Hooks.
  const { members } = useChannelMembers(channelId, currentUserId, channelType);
  const { blockUser } = useBlockUser();
  const { removeChannelMember } = useRemoveChannelMember();
  const { sendDirectMessage } = useSendMessage();

  const navigate = useNavigate();

  // Blocks user in simple channel.
  const handleBlock = async () => {
    console.log("Blocking user...");
    const blockListRequestDto: BlockUserRequestDto = {
      accountId: currentUserId,
      blockedId: members[0].accountId,
    };
    console.log("Block request object: ", blockListRequestDto);
    const blockResponse = await blockUser(blockListRequestDto);
    console.log("Response: ", blockResponse);
    if (blockResponse === 204) {
      // TODO: Show new block user follow up component Sana created.

      // Sends block message through web socket.
      const messagePayload: SendMessageComponent = {
        senderId: currentUserId,
        channelId: channelId,
        messageContent: `BLOCK*${currentUserId}*You blocked this user*You have been blocked by this user`,
        attachments: [],
        sentAt: new Date().toISOString(),
        type: "BLOCK",
        senderFirstName: "Walter", // TODO: Replace with actual first name from cookies
        avatarUrl:
          "https://sportganise-bucket.s3.us-east-2.amazonaws.com/walter_white_avatar.jpg",
      };
      sendDirectMessage(messagePayload, webSocketRef);

      const chatScreenInputArea = document.getElementById(
        "chatScreenInputArea",
      );
      if (chatScreenInputArea) {
        chatScreenInputArea.classList.add("pointer-events-none");
        chatScreenInputArea.classList.add("opacity-70");
      }
      setUserBlocked(true);
      log.debug("User blocked");
    } else {
      console.error("Error blocking user");
    }
    setIsBlockOpen(false);
  };

  const handleDelete = () => {
    console.log("Conversation deleted");
    setIsDeleteOpen(false);
  };

  const handleLeaveGroup = async () => {
    const response = await removeChannelMember(channelId, currentUserId);
    if (response?.status === 200) {
      log.info(`User ${currentUserId} left group ${channelId}`);
      const leaveMessageRemoverViewContent = "You left the group.";
      const leaveMessageContent = `Walter left the group.`; // TODO: Replace with actual first name from cookies.
      const messagePayload: SendMessageComponent = {
        senderId: currentUserId,
        channelId: channelId,
        messageContent: `LEAVE*${currentUserId}*${leaveMessageRemoverViewContent}*${leaveMessageContent}`,
        attachments: [],
        sentAt: new Date().toISOString(),
        type: "LEAVE",
        senderFirstName: "Walter", // TODO: Replace with actual first name from cookies.
        // TODO: Replace with actual avatar url from cookies.
        avatarUrl:
          "https://sportganise-bucket.s3.us-east-2.amazonaws.com/walter_white_avatar.jpg",
      };
      sendDirectMessage(messagePayload, webSocketRef);
      setIsLeaveGroupOpen(false);
      navigate("/pages/DirectMessagesDashboard");
    } else {
      log.error(`Error leaving group ${channelId}`);
    }
  };

  useEffect(() => {
    if (channelType === "GROUP") {
      for (let i = 0; i < members.length; i++) {
        if (members[i].accountId === currentUserId) {
          setCurrentMemberRole(members[i].role);
        }
      }
    }
  }, [members]);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 p-0 bg-placeholder-colour"
          >
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="font-font">
          {channelType === "SIMPLE" && (
            <>
              <DropdownMenuItem
                onSelect={() => setIsBlockOpen(true)}
                className={`${isBlocked || userBlocked ? "force-hide" : ""}
                text-red hover:text-white hover:bg-red cursor-pointer flex justify-between items-center`}
              >
                <span>Block</span>
                <Ban className="h-4 w-4 ml-2" />
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={() => setIsDeleteOpen(true)}
                className="text-red hover:text-white hover:bg-red cursor-pointer flex
                justify-between items-center"
              >
                <span>Delete</span>
                <Trash2 className="h-4 w-4 ml-2" />
              </DropdownMenuItem>
            </>
          )}
          {channelType === "GROUP" && (
            <>
              {/* GROUP Settings for ADMIN Members */}
              {currentMemberRole === GroupChannelMemberRole.ADMIN && (
                <>
                  <DropdownMenuItem
                    className="flex items-center justify-between py-3 font-font text-primaryColour
                      bg-white hover:bg-secondaryColour/20"
                    onSelect={() => setIsMembersSettingsOpen(true)}
                  >
                    <span>Members Settings</span>
                    <Users className="h-4 w-4 ml-2" />
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-primaryColour/20" />
                  <DropdownMenuItem
                    className="flex items-center justify-between py-3 font-font text-primaryColour
                      bg-white hover:bg-secondaryColour/20"
                    onSelect={() => setIsRenameGroupOpen(true)}
                  >
                    <span>Rename Group</span>
                    <Edit className="h-4 w-4 ml-2" />
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="flex items-center justify-between py-3 font-font text-primaryColour
                      bg-white hover:bg-secondaryColour/20"
                    onSelect={() => setIsChangePictureOpen(true)}
                  >
                    <span>Change Picture</span>
                    <Image className="h-4 w-4 ml-2" />
                  </DropdownMenuItem>
                </>
              )}
              {currentMemberRole == GroupChannelMemberRole.ADMIN && (
                <DropdownMenuSeparator className="bg-primaryColour/20" />
              )}
              <DropdownMenuItem
                className="flex items-center justify-between py-3 font-font text-primaryColour
                    bg-white hover:bg-secondaryColour/20 primary-red"
                onSelect={() => setIsLeaveGroupOpen(true)}
              >
                <span>Leave Group</span>
                <LogOutIcon className="h-4 w-4 ml-2" />
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Dialogs for Channel Settings */}
      <MembersSettingsDialog
        isOpen={isMembersSettingsOpen}
        onClose={() => setIsMembersSettingsOpen(false)}
        channelMembers={members}
        channelId={channelId}
        websocketRef={webSocketRef}
        currentUserId={currentUserId}
      />
      <RenameGroupDialog
        isOpen={isRenameGroupOpen}
        onClose={() => setIsRenameGroupOpen(false)}
        channelName={channelName}
        channelId={channelId}
        setCurrentChannelName={setCurrentChannelName}
        currentUserId={currentUserId}
        webSocketRef={webSocketRef}
      />
      <ChangePictureDialog
        isOpen={isChangePictureOpen}
        onClose={() => setIsChangePictureOpen(false)}
        currentChannelId={channelId}
        currentChannelPictureUrl={currentChannelPictureUrl}
        setCurrentChannelPictureUrl={setCurrentChannelPictureUrl}
        webSocketRef={webSocketRef}
      />
      <LeaveGroupDialog
        isOpen={isLeaveGroupOpen}
        onClose={() => setIsLeaveGroupOpen(false)}
        onLeave={handleLeaveGroup}
      />
      <AlertDialog open={isBlockOpen} onOpenChange={setIsBlockOpen}>
        <AlertDialogContent className="font-font" style={{ maxWidth: "90vw" }}>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure you want to block this user?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This user will no longer be able to
              interact with you.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              className="bg-white text-primaryColour hover:bg-fadedPrimaryColour
                hover:text-white font-font"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleBlock}
              className="bg-red text-white hover:bg-red/90 font-font"
            >
              Block User
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent className="font-font" style={{ maxWidth: "90vw" }}>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure you want to delete this conversation?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              conversation.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              className="bg-white text-primaryColour hover:bg-fadedPrimaryColour
                hover:text-white font-font"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red text-white hover:bg-red/90 font-font"
            >
              Delete Conversation
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
export default ChannelSettingsDropdown;
