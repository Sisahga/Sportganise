import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu.tsx";
import { Button } from "@/components/ui/Button.tsx";
import { Ban, MoreHorizontal, Trash2 } from "lucide-react";
import { useState } from "react";
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
import { ChannelSettingsDropdownProps } from "@/types/dmchannels.ts";
import useBlockUser from "@/hooks/useBlockUser.tsx";
import {BlockUserRequestDto} from "@/types/blocklist.ts";
import useChannelMembers from "@/hooks/useChannelMembers.tsx";

const ChannelSettingsDropdown = ({
  channelType, channelId
}: ChannelSettingsDropdownProps) => {
  const currentUserId = 2 // TODO: Replace with actual user ID from cookies
  const [isBlockOpen, setIsBlockOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const { members } =
      useChannelMembers(channelId, currentUserId, channelType);
  const { blockUser } = useBlockUser();

  // Blocks user in simple channel.
  const handleBlock = async () => {
    console.log("Blocking user...");
    const blockListRequestDto: BlockUserRequestDto = {
      channelId: channelId,
      userId: currentUserId,
      blockedId: members[0].accountId,
    };
    const blockResponse = await blockUser(blockListRequestDto);
    if (blockResponse?.statusCode === 201 ) {
      // TODO: Show new block user follow up component Sana created.
      console.log("User blocked successfully");
    } else {
      console.error("Error blocking user");
    }
    setIsBlockOpen(false);
  };

  const handleDelete = () => {
    console.log("Conversation deleted");
    setIsDeleteOpen(false);
  };

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
          {channelType === "SIMPLE" ? (
            <>
              <DropdownMenuItem
                onSelect={() => setIsBlockOpen(true)}
                className="text-red hover:text-white hover:bg-red cursor-pointer flex justify-between items-center"
              >
                <span>Block</span>
                <Ban className="h-4 w-4 ml-2" />
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={() => setIsDeleteOpen(true)}
                className="text-red hover:text-white hover:bg-red cursor-pointer flex justify-between items-center"
              >
                <span>Delete</span>
                <Trash2 className="h-4 w-4 ml-2" />
              </DropdownMenuItem>
            </>
          ) : (
            <></>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

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
            <AlertDialogCancel className="bg-white text-primaryColour hover:bg-fadedPrimaryColour hover:text-white font-font">
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
            <AlertDialogCancel className="bg-white text-primaryColour hover:bg-fadedPrimaryColour hover:text-white font-font">
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
