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
import {
  SendMessageComponent,
  UserBlockedComponentProps,
} from "@/types/messaging.ts";
import { LockIcon as UserUnlock } from "lucide-react";
import { useState } from "react";
import useUnblockUser from "@/hooks/useUnblockUser.ts";
import { BlockUserRequestDto } from "@/types/blocklist.ts";
import useChannelMembers from "@/hooks/useChannelMembers.ts";
import useSendMessage from "@/hooks/useSendMessage.ts";
import log from "loglevel";

const UserBlockedComponent = ({
  showBlockedMessage,
  channelIsBlocked,
  webSocketRef,
  channelId,
  channelType,
}: UserBlockedComponentProps) => {
  const currentUserId = 2; // TODO: Replace with actual user ID from cookies
  const { members } = useChannelMembers(channelId, currentUserId, channelType);
  const { unblockUser } = useUnblockUser();
  const { sendDirectMessage } = useSendMessage();
  const [showComponent, setShowComponent] = useState(showBlockedMessage);

  const handleUnblock = async () => {
    log.info("Unblocking user...");
    if (channelType === "SIMPLE") {
      const unblockListRequestDto: BlockUserRequestDto = {
        accountId: currentUserId,
        blockedId: members[0].accountId,
      };
      const unblockResponse = await unblockUser(unblockListRequestDto);
      if (unblockResponse === 204) {
        log.info("User unblocked successfully.");
        // Sends unblock message through web socket.
        const messagePayload: SendMessageComponent = {
          senderId: currentUserId,
          channelId: channelId,
          messageContent: `UNBLOCK*${currentUserId}*You unblocked this user*You have been unblocked by this user`,
          attachments: [],
          sentAt: new Date().toISOString(),
          type: "UNBLOCK",
          senderFirstName: "Walter", // TODO: Replace with actual first name from cookies
          avatarUrl:
            "https://sportganise-bucket.s3.us-east-2.amazonaws.com/walter_white_avatar.jpg",
        };
        sendDirectMessage(messagePayload, webSocketRef);
        setShowComponent(false);
      }
    }
  };

  return (
    <Drawer
      direction="bottom"
      open={showComponent}
      onOpenChange={setShowComponent}
    >
      <DrawerTrigger asChild>
        {/* change this button so that is is when you click on a user account in the list of Dm's */}
        <Button
          variant="outline"
          className={`gap-2 py-8 ${!showComponent && channelIsBlocked ? "" : "force-hide"}`}
        >
          <UserUnlock className="h-4 w-4 font-font text-primaryColour" />
          Unblock User
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle className="text-center font-font text-primaryColour">
              Blocked
            </DrawerTitle>
            <DrawerDescription className="text-center font-font text-primaryColour/50 mt-2">
              Unblock this user to send a message.
            </DrawerDescription>
          </DrawerHeader>
          <DrawerFooter>
            <Button onClick={handleUnblock}>Unblock User</Button>
            <DrawerClose asChild>
              <Button variant="outline">Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
};
export default UserBlockedComponent;
