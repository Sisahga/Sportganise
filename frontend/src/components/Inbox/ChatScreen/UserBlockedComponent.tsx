import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle, DrawerTrigger,
} from "@/components/ui/drawer.tsx";
import {Button} from "@/components/ui/Button.tsx";
import {UserBlockedComponentProps} from "@/types/messaging.ts";
import {LockIcon as UserUnlock} from "lucide-react";
import {useState} from "react";

const UserBlockedComponent =
    ({showBlockedMessage, channelIsBlocked}: UserBlockedComponentProps) => {
  const handleUnblock = async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log("User unblocked");
  };
  const [showComponent, setShowComponent] = useState(showBlockedMessage);
  console.log("showBlockedMessage: ", showBlockedMessage);
  console.log("channelIsBlocked: ", channelIsBlocked);

  return (
        <Drawer direction="bottom" open={showComponent} onOpenChange={setShowComponent}>
          <DrawerTrigger asChild>
            {/* change this button so that is is when you click on a user account in the list of Dm's */}
            <Button variant="outline"
                    className={`gap-2 py-8 ${!showComponent && channelIsBlocked ? "" : "force-hide"}`}>
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
                <Button onClick={handleUnblock}>
                  Unblock User
                </Button>
                <DrawerClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DrawerClose>
              </DrawerFooter>
            </div>
          </DrawerContent>
        </Drawer>
  )
}
export default UserBlockedComponent;