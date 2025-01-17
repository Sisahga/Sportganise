"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { LockIcon as UserUnlock } from "lucide-react";

interface UnblockUserDrawerProps {
  username: string;
  onUnblock: () => Promise<void>;
}

function UnblockUserDrawer({ username, onUnblock }: UnblockUserDrawerProps) {
  const [isUnblocking, setIsUnblocking] = useState(false);

  const handleUnblock = async () => {
    setIsUnblocking(true);
    try {
      await onUnblock();
    } catch (error) {
      console.error("Failed to unblock user:", error);
    } finally {
      setIsUnblocking(false);
    }
  };

  return (
    <Drawer direction="bottom">
      <DrawerTrigger asChild>
        {/* change this button so that is is when you click on a user account in the list of Dm's */}
        <Button variant="outline" className="gap-2">
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
              Unblock {username} to send a message.
            </DrawerDescription>
          </DrawerHeader>
          <DrawerFooter>
            <Button onClick={handleUnblock} disabled={isUnblocking}>
              {isUnblocking ? "Unblocking..." : "Unblock"}
            </Button>
            <DrawerClose asChild>
              <Button variant="outline">Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

export default function Unblock() {
  const handleUnblock = async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log("User unblocked");
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <UnblockUserDrawer username="JohnDoe" onUnblock={handleUnblock} />
    </main>
  );
}
