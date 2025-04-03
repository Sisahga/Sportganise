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
import { LoaderCircle, LockIcon as UserUnlock } from "lucide-react";
import { useEffect, useState } from "react";
import useUnblockUser from "@/hooks/useUnblockUser.ts";
import { BlockUserRequestDto } from "@/types/blocklist.ts";
import useChannelMembers from "@/hooks/useChannelMembers.ts";
import useSendMessage from "@/hooks/useSendMessage.ts";
import log from "loglevel";
import { getAccountIdCookie } from "@/services/cookiesService.ts";

const UserBlockedComponent = ({
  showBlockedMessage,
  channelIsBlocked,
  webSocketRef,
  channelId,
  channelType,
  cookies,
}: UserBlockedComponentProps) => {
  const currentUserId = getAccountIdCookie(cookies);
  const { fetchChannelMembers, members } = useChannelMembers(
    channelId,
    channelType,
  );
  const { unblockUser } = useUnblockUser();
  const { sendDirectMessage } = useSendMessage();
  const [showComponent, setShowComponent] = useState(showBlockedMessage);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchChannelMembers(currentUserId).then((_) => {
      setLoading(false);
    });
  }, [fetchChannelMembers]);

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
          sentAt: new Date().toISOString(),
          type: "UNBLOCK",
          senderFirstName: cookies.firstName,
          avatarUrl: cookies.pictureUrl,
        };
        await sendDirectMessage(messagePayload, webSocketRef);
        setShowComponent(false);
      }
    }
  };

  if (loading) {
    return (
      <div>
        <LoaderCircle className="animate-spin h-6 w-6" />
      </div>
    );
  }

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
          <UserUnlock className="h-4 w-4 text-primaryColour" />
          Unblock User
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle className="text-center text-primaryColour">
              Blocked
            </DrawerTitle>
            <DrawerDescription className="text-center text-primaryColour/50 mt-2">
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
